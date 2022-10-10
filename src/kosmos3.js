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
   * Считывание заголовка объекта
   *
   * @param {string} Key Имя файла
   */
  const headObject = async (Key) => {
    const Bucket = get(bucket);
    await get(s3).send(new HeadObjectCommand({ Bucket, Key }));
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
    if (newS3)
      try {
        const head = await Promise.allSettled([
          headObject("index.json"),
          headObject("index.cdn.json"),
          headObject("index.js"),
          headObject("index.css"),
          headObject("index.cdn.css"),
          headObject("index.htm"),
        ]);
        const put = [];
        if (head[0].status === "rejected") {
          const id = crypto.randomUUID();
          put.push(
            putObject(
              "index.json",
              "application/json",
              `{"visible":true,"value":"${get(bucket)}","id":${id}}`
            )
          );
          put.push(putObject(`${id}.htm`, "text/html", ""));
        }
        if (head[1].status === "rejected")
          put.push(putObject("index.cdn.json", "application/json", "[]"));
        if (head[2].status === "rejected")
          put.push(
            putObject(
              "index.js",
              "application/javascript",
              "function init(){try{}catch(e){}}"
            )
          );
        if (head[3].status === "rejected")
          put.push(putObject("index.css", "text/css", ""));
        if (head[4].status === "rejected")
          put.push(putObject("index.cdn.css", "text/css", ""));
        if (head[5].status === "rejected")
          put.push(
            putObject(
              "index.htm",
              "text/html",
              '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!template"></article><article v-else><v-runtime-template :parent="this" :template="template"></v-runtime-template></article></div></div>'
            )
          );
        await Promise.all(put);
        const file = await Promise.all([
          getObject("index.json"),
          getObject("index.cdn.json"),
          getObject("index.js"),
          getObject("index.css"),
          getObject("index.cdn.css"),
          getObject("index.htm"),
        ]);
        set(semantics, JSON.parse(file[0]));
        set(js, JSON.parse(file[1]));
        set(javascript, file[2]);
        set(style, file[3]);
        set(css, file[4]);
        set(template, file[5]);
      } catch (err) {
        set(message, err.message);
        set(snackbar, true);
      }
    else {
      set(semantics, null);
      set(js, null);
      set(javascript, null);
      set(style, null);
      set(css, null);
      set(template, null);
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
    ...{ s3, putObject, putFile },
  };
});
