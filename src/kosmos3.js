import { ref, computed, watch } from "vue";
import { get, set, watchDebounced } from "@vueuse/core";
import { defineStore } from "pinia";
import {
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

export default defineStore("kosmos3", () => {
  /**
   * настройки фильтра
   *
   * @constant {object}
   */
  const debounce = { debounce: 1000, maxWait: 10000 };
  /**
   * текст сообщения об ошибке
   *
   * @type {string}
   */
  const message = ref("");
  /**
   * переключатель видимости сообщения об ошибке
   *
   * @type {boolean}
   */
  const snackbar = ref(false);
  /**
   * переключатель видимости правой панели
   *
   * @type {boolean}
   */
  const panel = ref(null);
  /**
   * корзина в сервисе s3
   *
   * @type {string}
   */
  const bucket = ref("");
  /**
   * путь к сайту через сервис s3
   *
   * @type {string}
   */
  const wendpoint = ref("");
  /**
   * клиент к сервису s3
   *
   * @type {object}
   */
  const s3 = ref(null);
  /**
   * контент выбранной страницы сайта
   *
   * @type {string}
   */
  const content = ref(null);
  /**
   * семантическое ядро сайта
   *
   * @type {object}
   */
  const semantics = ref(null);
  /**
   * дизайн-шаблон сайта
   *
   * @type {string}
   */
  const template = ref(null);
  /**
   * инлайн стили сайта
   *
   * @type {string}
   */
  const style = ref(null);
  /**
   * подключаемые стили сайта
   *
   * @type {string}
   */
  const css = ref(null);
  /**
   * инлайн скрипт сайта
   *
   * @type {string}
   */
  const javascript = ref(null);
  /**
   * подключаемые скрипты сайта
   *
   * @type {object}
   */
  const js = ref(null);
  const base = computed(() =>
    get(wendpoint)
      ? `${get(wendpoint)}/${get(bucket)}/`
      : `https://${get(bucket)}/`
  );
  /**
   * считывание заголовка файла
   *
   * @param {string} Key имя файла
   * @returns {object} заголовок файла
   */
  const headObject = async (Key) => {
    const Bucket = get(bucket);
    const head = await get(s3).send(new HeadObjectCommand({ Bucket, Key }));
    return head;
  };
  /**
   * Запись объекта
   *
   * @param {string} Key имя файла
   * @param {string} ContentType тип mime
   * @param {string | Uint8Array | Buffer} body тело файла
   */
  const putObject = async (Key, ContentType, body) => {
    const Bucket = get(bucket);
    const Body =
      typeof body === "string" ? new TextEncoder().encode(body) : body;
    await get(s3).send(
      new PutObjectCommand({ Bucket, Key, ContentType, Body })
    );
  };
  /**
   * Запись файла
   *
   * @param {string} Key имя файла
   * @param {string} ContentType тип mime
   * @param {File} file файл
   */
  const putFile = async (Key, ContentType, file) => {
    await putObject(
      Key,
      ContentType,
      await new Promise((resolve) => {
        const reader = new FileReader();
        /** @returns {Buffer} загруженный файл */
        reader.onloadend = () => resolve(reader.result);
        reader.readAsArrayBuffer(file);
      })
    );
  };
  /**
   * Считывание объекта
   *
   * @param {string} Key Имя файла
   * @returns {string} Тело файла
   */
  const getObject = async (Key) => {
    const Bucket = get(bucket);
    const ResponseCacheControl = "no-store";
    const { Body } = await get(s3).send(
      new GetObjectCommand({ ResponseCacheControl, Bucket, Key })
    );
    const ret = await new Promise((resolve) => {
      const reader = Body.getReader();
      const textDecoder = new TextDecoder();
      (async function read(chunks) {
        const { done, value } = await reader.read();
        if (done) resolve(chunks.join(""));
        else {
          chunks.push(textDecoder.decode(value));
          read(chunks);
        }
      })([]);
    });
    return ret;
  };
  watch(s3, async (newS3) => {
    const files = [
      {
        key: "index.json",
        contentType: "application/json",
        value: `{"visible":true,"value":"${get(
          bucket
        )}","id":"${crypto.randomUUID()}"}`,
        ref: semantics,
        parse: true,
      },
      {
        key: "index.cdn.json",
        contentType: "application/json",
        value: "[]",
        ref: js,
        parse: true,
      },
      {
        key: "index.js",
        contentType: "application/javascript",
        value: "function init(){try{}catch(e){}}",
        ref: javascript,
        parse: false,
      },
      { key: "index.css", contentType: "text/css", value: "", ref: style },
      {
        key: "index.cdn.css",
        contentType: "text/css",
        value: "",
        ref: css,
        parse: false,
      },
      {
        key: "index.htm",
        contentType: "text/html",
        value:
          '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!template"></article><article v-else><v-runtime-template :parent="this" :template="template"></v-runtime-template></article></div></div>',
        ref: template,
        parse: false,
      },
    ];
    if (newS3) {
      try {
        const objects = await Promise.allSettled(
          files.map((file) => getObject(file.key))
        );
        objects.forEach((object, index) => {
          const value = object.value || files[index].value;
          if (object.status === "rejected")
            putObject(files[index].key, files[index].contentType, value);
          set(files[index].ref, files[index].parse ? JSON.parse(value) : value);
        });
      } catch (err) {
        // console.log(err.message);
      }
      try {
        const excluded = ["index.htm", "site.webmanifest"];
        const included = ["robots.txt", "error.html", "browserconfig.xml"];
        const assets = Object.values(
          await (await fetch("orbita/assets-manifest.json")).json()
        ).filter((asset) => !excluded.includes(asset));
        const heads = await Promise.allSettled(
          assets.map((asset) => headObject(asset))
        );
        const names = assets.filter(
          (asset, index) =>
            heads[index].status === "rejected" || included.includes(asset)
        );
        const bodies = await Promise.all(
          names.map((name) => fetch(`orbita/${name}`))
        );
        const blobs = await Promise.all(
          bodies.map((body, index) =>
            included.includes(names[index]) ? body.text() : body.blob()
          )
        );
        blobs.forEach((blob, index) => {
          const name = names[index];
          const head = included.includes(name)
            ? heads[assets.indexOf(name)]
            : null;
          if (
            !head ||
            (head.status === "fulfilled" &&
              head.value.ContentLength !==
                new TextEncoder().encode(blob).length)
          )
            putObject(
              name,
              blob.type,
              name === "robot.txt"
                ? blob.replace(/{{ domain }}/g, get(bucket))
                : blob
            );
        });
      } catch (err) {
        // console.log(err.message);
      }
    } else {
      files.forEach((file) => {
        set(file.ref, null);
      });
    }
  });
  watchDebounced(
    semantics,
    () => {
      set(message, "semantics changed!");
      set(snackbar, true);
    },
    { deep: true, ...debounce }
  );
  watchDebounced(
    js,
    () => {
      set(message, "js changed!");
      set(snackbar, true);
    },
    debounce
  );
  watchDebounced(
    javascript,
    () => {
      set(message, "javascript changed!");
      set(snackbar, true);
    },
    debounce
  );
  watchDebounced(
    style,
    () => {
      set(message, "style changed!");
      set(snackbar, true);
    },
    debounce
  );
  watchDebounced(
    css,
    () => {
      set(message, "css changed!");
      set(snackbar, true);
    },
    debounce
  );
  watchDebounced(
    template,
    () => {
      set(message, "template changed!");
      set(snackbar, true);
    },
    debounce
  );
  watchDebounced(
    content,
    () => {
      set(message, "content changed!");
      set(snackbar, true);
    },
    debounce
  );
  return {
    ...{ bucket, wendpoint, base },
    ...{ panel, snackbar, message },
    ...{
      content,
      semantics,
      template,
      js,
      javascript,
      css,
      style,
    },
    ...{ s3, putFile },
  };
});
