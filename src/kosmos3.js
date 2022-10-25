import { ref, computed, watch } from "vue";
import {
  get,
  set,
  watchDebounced,
  useFetch,
  watchTriggerable,
} from "@vueuse/core";
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
  const content = ref(undefined);
  /**
   * семантическое ядро сайта
   *
   * @type {object}
   */
  const semantics = ref(undefined);
  /**
   * дизайн-шаблон сайта
   *
   * @type {string}
   */
  const template = ref(undefined);
  /**
   * инлайн стили сайта
   *
   * @type {string}
   */
  const style = ref(undefined);
  /**
   * подключаемые стили сайта
   *
   * @type {string}
   */
  const styles = ref(undefined);
  /**
   * подключаемые скрипты сайта
   *
   * @type {object}
   */
  const scripts = ref(undefined);
  /**
   * настройки сайта
   *
   * @type {object}
   */
  const settings = ref(undefined);
  /**
   * скрипт запускаемый на каждой странице
   *
   * @type {string}
   */
  const script = ref(undefined);
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

  const { data: assetsData } = useFetch("orbita/assets-manifest.json").json();
  const assets = computed(() =>
    get(assetsData)
      ? Object.values(get(assetsData)).filter(
          (asset) => !["index.htm", "site.webmanifest"].includes(asset)
        )
      : undefined
  );
  const { trigger: assetsTrigger } = watchTriggerable(assets, (value) => {
    if (get(s3))
      value.forEach((asset) => {
        (async () => {
          try {
            const head = await headObject(asset);
            if (
              ["robots.txt", "error.html", "browserconfig.xml"].includes(asset)
            )
              throw new Error(head.ContentLength);
          } catch (e) {
            const byteLength = +e.message;
            let { data: body } = await useFetch(`orbita/${asset}`).blob();
            if (!Number.isNaN(byteLength)) {
              body = new Blob(
                [(await body.text()).replace(/{{ domain }}/g, get(bucket))],
                { type: body.type }
              );
              if (byteLength === (await body.arrayBuffer()).byteLength)
                body = null;
            }
            if (body) putObject(asset, body.type, body);
          }
        })();
      });
  });

  const base = computed(() =>
    get(wendpoint)
      ? `${get(wendpoint)}/${get(bucket)}/`
      : `https://${get(bucket)}/`
  );
  const files = computed(() => [
    {
      key: "index.json",
      contentType: "application/json",
      value: `{"visible":true,"value":"${get(
        bucket
      )}","id":"${crypto.randomUUID()}"}`,
      ref: semantics,
      /**
       *
       * @param {string} text параметр трансформации
       * @returns {object} результат трасформации
       */
      transform(text) {
        let value;
        try {
          value = JSON.parse(text);
        } catch (e) {
          value = this.value;
        }
        return value;
      },
    },
    {
      key: "settings.json",
      contentType: "application/json",
      value: "{}",
      ref: settings,
      /**
       *
       * @param {string} text параметр трансформации
       * @returns {object} результат трасформации
       */
      transform(text) {
        let value;
        try {
          value = JSON.parse(text);
        } catch (e) {
          value = this.value;
        }
        return value;
      },
    },
    {
      key: "scripts.json",
      contentType: "application/json",
      value: "[]",
      ref: scripts,
      /**
       *
       * @param {string} text параметр трансформации
       * @returns {object} результат трасформации
       */
      transform(text) {
        let value;
        try {
          value = JSON.parse(text)
            .filter(Boolean)
            .filter((element) => element.url && element.id);
        } catch (e) {
          value = this.value;
        }
        return value.length ? value : [{ url: "", id: crypto.randomUUID() }];
      },
    },
    {
      key: "index.js",
      contentType: "application/javascript",
      value: "",
      ref: script,
    },
    {
      key: "index.css",
      contentType: "text/css",
      value: "",
      ref: style,
    },
    {
      key: "styles.json",
      contentType: "application/json",
      value: "[]",
      ref: styles,
      /**
       *
       * @param {string} text параметр трансформации
       * @returns {object} результат трасформации
       */
      transform(text) {
        let value;
        try {
          value = JSON.parse(text)
            .filter(Boolean)
            .filter((element) => element.url && element.id);
        } catch (e) {
          value = this.value;
        }
        return value.length
          ? value
          : [
              {
                url: "https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css",
                id: crypto.randomUUID(),
              },
            ];
      },
    },
    {
      key: "index.htm",
      contentType: "text/html",
      value:
        '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!template"></article><article v-else><v-runtime-template :parent="this" :template="template"></v-runtime-template></article></div></div>',
      ref: template,
    },
  ]);
  watch(s3, async (newS3) => {
    if (newS3) {
      get(files).forEach((file) => {
        (async () => {
          let { value } = file;
          try {
            value = await getObject(file.key);
          } catch (err) {
            putObject(file.key, file.contentType, value);
          }
          set(file.ref, file.transform ? file.transform(value) : value);
        })();
      });
      assetsTrigger();
    } else
      get(files).forEach((file) => {
        set(file.ref, null);
      });
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
    settings,
    (value, oldValue) => {
      if (value && oldValue)
        putObject("settings.json", "application/json", JSON.stringify(value));
    },
    { deep: true, ...debounce }
  );
  watchDebounced(
    scripts,
    (value, oldValue) => {
      if (value && oldValue)
        putObject(
          "scripts.json",
          "application/json",
          JSON.stringify(value.filter((element) => element.url))
        );
    },
    { deep: true, ...debounce }
  );
  watchDebounced(
    script,
    (value, oldValue) => {
      if (value && oldValue)
        putObject("index.js", "application/javascript", value);
    },
    debounce
  );
  watchDebounced(
    style,
    (value, oldValue) => {
      if (value && oldValue) putObject("index.css", "text/css", value);
    },
    debounce
  );
  watchDebounced(
    styles,
    (value, oldValue) => {
      if (value && oldValue)
        putObject(
          "styles.json",
          "application/json",
          JSON.stringify(value.filter((element) => element.url))
        );
    },
    { deep: true, ...debounce }
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
      settings,
      content,
      semantics,
      template,
      scripts,
      script,
      styles,
      style,
    },
    ...{ s3, putFile },
  };
});
