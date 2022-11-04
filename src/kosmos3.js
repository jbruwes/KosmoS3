import { ref, computed } from "vue";
import {
  get,
  set,
  watchDebounced,
  useFetch,
  whenever,
  isDefined,
} from "@vueuse/core";
import { logicAnd, logicNot } from "@vueuse/math";
import { defineStore } from "pinia";
import {
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import Konva from "konva";

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
  const panel = ref();
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
  const s3 = ref();
  /**
   * контент выбранной страницы сайта
   *
   * @type {string}
   */
  const content = ref();
  /**
   * семантическое ядро сайта
   *
   * @type {object}
   */
  const tree = ref();
  /**
   * дизайн-шаблон сайта
   *
   * @type {string}
   */
  const template = ref();
  /**
   * инлайн стили сайта
   *
   * @type {string}
   */
  const style = ref();
  /**
   * подключаемые стили сайта
   *
   * @type {string}
   */
  const styles = ref();
  /**
   * подключаемые скрипты сайта
   *
   * @type {object}
   */
  const scripts = ref();
  /**
   * настройки сайта
   *
   * @type {object}
   */
  const settings = ref();
  /**
   * скрипт запускаемый на каждой странице
   *
   * @type {string}
   */
  const script = ref();
  const semantics = computed(() =>
    Array.isArray(get(tree)) && get(tree).length ? get(tree)[0] : undefined
  );
  /**
   * считывание заголовка файла
   *
   * @param {string} Key имя файла
   * @returns {object} заголовок файла
   */
  const headObject = async (Key) => {
    const Bucket = get(bucket);
    let head;
    if (isDefined(s3))
      head = await get(s3).send(new HeadObjectCommand({ Bucket, Key }));
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
    if (isDefined(s3))
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
    let ret;
    if (isDefined(s3)) {
      const { Body } = await get(s3).send(
        new GetObjectCommand({ ResponseCacheControl, Bucket, Key })
      );
      ret = await new Promise((resolve) => {
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
    }
    return ret;
  };
  const { data: templateData } = useFetch("orbita/index.htm");
  const title = computed(() => {
    try {
      return (get(semantics).title || get(semantics).value).replace(
        /"/g,
        "&quot;"
      );
    } catch (e) {
      return "";
    }
  });
  const description = computed(() => {
    try {
      return get(semantics).description.replace(/"/g, "&quot;");
    } catch (e) {
      return "";
    }
  });
  const keywords = computed(() => {
    try {
      return get(semantics).keywords.replace(/"/g, "&quot;");
    } catch (e) {
      return "";
    }
  });
  const image = computed(() => {
    try {
      return get(semantics).image
        ? `https://${get(bucket)}/${encodeURI(get(semantics).image)}`
        : "";
    } catch (e) {
      return "";
    }
  });
  const yandex = computed(() => {
    try {
      return get(settings).yandex.replace(/"/g, "&quot;");
    } catch (e) {
      return "";
    }
  });
  const google = computed(() => {
    try {
      return get(settings).google.replace(/"/g, "&quot;");
    } catch (e) {
      return "";
    }
  });
  const stylesheets = computed(() => {
    try {
      return get(styles)
        .filter((element) => element.id && element.url)
        .map(
          (element) =>
            `<link href="${encodeURI(element.url)}" rel="stylesheet">`
        )
        .join("");
    } catch (e) {
      return "";
    }
  });
  const javascripts = computed(() => {
    try {
      return get(scripts)
        .filter((element) => element.id && element.url)
        .map(
          (element) =>
            `<script defer="defer" src="${encodeURI(element.url)}"></script>`
        )
        .join("");
    } catch (e) {
      return "";
    }
  });
  const metrika = computed(() => {
    try {
      return get(settings).metrika.replace(/"/g, "&quot;");
    } catch (e) {
      return "";
    }
  });
  const analytics = computed(() => {
    try {
      return get(settings).analytics.replace(/"/g, "&quot;");
    } catch (e) {
      return "";
    }
  });
  /**
   *
   *
   * @param {object} value объект слоя
   * @returns {object} нормализованный объект слоя
   */
  const calcLayer = (value) => {
    let lValue = { ...value };
    lValue = { ...lValue, params: lValue.params || {} };
    lValue = {
      ...lValue,
      id: lValue.id || crypto.randomUUID(),
      x: lValue.x || 0,
      y: lValue.y || 0,
      width: lValue.width || 1,
      height: lValue.height || 1,
      rotation: lValue.rotation || 0,
      fill: lValue.fill || Konva.Util.getRandomColor(),
      opacity: 0.1,
      name: lValue.name || "",
      draggable: true,
      /** @returns {number} сдвиг по x */
      get offsetX() {
        return lValue.width / 2;
      },
      /** @returns {number} сдвиг по y */
      get offsetY() {
        return lValue.height / 2;
      },
      edit: false,
      params: {
        ...(lValue.params || {}),
        position: lValue.params.position || "static",
        type: lValue.params.type || "fluid",
        x: lValue.params.x || [0, 100],
        y: lValue.params.y || [0, 100],
      },
    };
    return lValue;
  };

  const templateHtml = computed(() => {
    let value;
    if (
      isDefined(templateData) &&
      isDefined(semantics) &&
      isDefined(settings) &&
      isDefined(styles) &&
      isDefined(scripts)
    ) {
      value = get(templateData);
      value = value
        .replace(/{{ base }}/g, "/")
        .replace(/{{ title }}/g, get(title))
        .replace(/{{ description }}/g, get(description))
        .replace(/{{ keywords }}/g, get(keywords))
        .replace(/{{ image }}/g, get(image))
        .replace(/{{ yandex }}/g, get(yandex))
        .replace(/{{ google }}/g, get(google))
        .replace(/{{ styles }}/g, get(stylesheets))
        .replace(/{{ scripts }}/g, get(javascripts));
      value = get(metrika)
        ? value.replace(/{{ metrika }}/g, get(metrika))
        : value.replace(/<script id="yandex"[^>]*>([\s\S]*?)<\/script>/gi, "");
      value = get(analytics)
        ? value.replace(/{{ analytics }}/g, get(analytics))
        : value.replace(/<script id="google"[^>]*>([\s\S]*?)<\/script>/gi, "");
    }
    return value;
  });
  const { data: assetsData } = useFetch("orbita/assets-manifest.json").json();
  const assets = computed(() =>
    isDefined(assetsData)
      ? Object.values(get(assetsData)).filter(
          (asset) => !["index.htm", "site.webmanifest"].includes(asset)
        )
      : undefined
  );
  const base = computed(() =>
    isDefined(wendpoint)
      ? `${get(wendpoint)}/${get(bucket)}/`
      : `https://${get(bucket)}/`
  );
  const files = computed(() => [
    {
      key: "index.json",
      contentType: "application/json",
      value: "[]",
      ref: tree,
      /**
       *
       * @param {string} text параметр трансформации
       * @returns {object} результат трасформации
       */
      transform(text) {
        let value;
        try {
          [value] = JSON.parse(text);
          value = [value].filter(Boolean);
        } catch (e) {
          value = JSON.parse(this.value);
        }
        if (!value.length)
          value.push({
            visible: true,
            value: get(bucket),
            id: crypto.randomUUID(),
          });
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
          value = JSON.parse(this.value);
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
          value = JSON.parse(text);
          if (!Array.isArray(value)) value = [value];
          value.filter(Boolean).filter((element) => element.url);
        } catch (e) {
          value = JSON.parse(this.value);
        }
        if (!value.length) value.push({ url: "" });
        value.forEach((element) => {
          Object.defineProperty(element, "id", {
            value: element.id || crypto.randomUUID(),
            enumerable: true,
          });
        });
        return value;
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
          value = JSON.parse(text);
          if (!Array.isArray(value)) value = [value];
          value.filter(Boolean).filter((element) => element.url);
        } catch (e) {
          value = JSON.parse(this.value);
        }
        if (!value.length)
          value.push({
            url: "https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css",
          });
        value.forEach((element) => {
          Object.defineProperty(element, "id", {
            value: element.id || crypto.randomUUID(),
            enumerable: true,
          });
        });
        return value;
      },
    },
    /*
    {
      key: "index.htm",
      contentType: "text/html",
      value:
        '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!template"></article><article v-else><v-runtime-template :parent="this" :template="template"></v-runtime-template></article></div></div>',
      ref: template,
    },
    */
    {
      key: "template.json",
      contentType: "application/json",
      value: "[]",
      ref: template,
      /**
       *
       * @param {string} text параметр трансформации
       * @returns {object} результат трасформации
       */
      transform(text) {
        let value;
        try {
          value = JSON.parse(text).filter(Boolean);
        } catch (e) {
          value = JSON.parse(this.value);
        }
        if (!value.find((element) => element.name === "content"))
          value.push({ name: "content" });
        return value.map((element) => calcLayer(element));
      },
    },
  ]);
  whenever(s3, async () => {
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
  });
  whenever(logicNot(s3), () => {
    get(files).forEach((file) => {
      set(file.ref, null);
    });
  });
  whenever(logicAnd(s3, assets), () => {
    get(assets).forEach((asset) => {
      (async () => {
        try {
          const head = await headObject(asset);
          if (["robots.txt", "error.html", "browserconfig.xml"].includes(asset))
            throw new Error(head.ContentLength);
        } catch (e) {
          const byteLength = +e.message;
          const { data: body } = await useFetch(`orbita/${asset}`).blob();
          let lBody = null;
          if (Number.isNaN(byteLength)) lBody = get(body);
          else {
            const blob = new Blob(
              [(await get(body).text()).replace(/{{ domain }}/g, get(bucket))],
              { type: get(body).type }
            );
            if (byteLength !== (await blob.arrayBuffer()).byteLength)
              lBody = blob;
          }
          if (lBody) putObject(asset, lBody.type, lBody);
        }
      })();
    });
  });
  watchDebounced(
    tree,
    () => {
      set(message, "tree changed!");
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
    (value, oldValue) => {
      if (value && oldValue)
        putObject("template.json", "application/json", JSON.stringify(value));
    },
    { deep: true, ...debounce }
  );
  watchDebounced(
    content,
    () => {
      set(message, "content changed!");
      set(snackbar, true);
    },
    debounce
  );
  watchDebounced(
    templateHtml,
    () => {
      set(message, "templateHtml changed!");
      set(snackbar, true);
    },
    { deep: true, ...debounce }
  );
  return {
    ...{ bucket, wendpoint, base },
    ...{ panel, snackbar, message },
    ...{
      settings,
      content,
      tree,
      semantics,
      template,
      scripts,
      script,
      styles,
      style,
    },
    ...{ s3, putFile },
    ...{ calcLayer },
  };
});
