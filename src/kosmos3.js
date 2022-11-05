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
   * индекс сайта
   *
   * @type {object}
   */
  const index = ref();
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
  /**
   *
   *
   * @param {object} value объект слоя
   * @returns {object} нормализованный объект слоя
   */
  const calcLayer = (value) => {
    const opacity = 0.1;
    const draggable = true;
    const edit = false;
    const offsetX = 0.5;
    const offsetY = 0.5;
    let { params } = value || {};
    {
      let { position, type, x, y } = params || {};
      position = position || "static";
      type = type || "fluid";
      x = Array.isArray(x) ? x : [0, 100];
      y = Array.isArray(y) ? y : [0, 100];
      params = { ...params, position, type, x, y };
    }
    let { id, x, y, scaleX, scaleY, width, height, rotation, fill, name } =
      value || {};
    id = id || crypto.randomUUID();
    x = x || 0;
    y = y || 0;
    scaleX = scaleX || 100;
    scaleY = scaleY || 100;
    width = width || 1;
    height = height || 1;
    rotation = rotation || 0;
    fill = fill || Konva.Util.getRandomColor();
    name = name || "";
    return {
      ...{ opacity, draggable, edit, offsetX, offsetY },
      ...{
        id,
        x,
        y,
        scaleX,
        scaleY,
        width,
        height,
        rotation,
        fill,
        name,
        params,
      },
    };
  };
  whenever(s3, async () => {
    let content;
    let template;
    let css;
    let style;
    let js;
    let script;
    let settings;
    try {
      ({ content, template, css, style, js, script, settings } = JSON.parse(
        await getObject("index.json")
      ));
    } finally {
      content = {
        ...content,
        id: content.id || crypto.randomUUID(),
        value: content.value || get(bucket),
        visible: content.visible === undefined ? true : !!content.visible,
      };
      template = Array.isArray(template) ? template.filter(Boolean) : [];
      if (!template.find((element) => element.name === "content"))
        template.push({ name: "content" });
      template = template.map((element) => calcLayer(element));
      css = Array.isArray(css)
        ? css
            .map((element) => {
              let { id, url } = element || {};
              id = id || crypto.randomUUID();
              url = url || "";
              return { id, url };
            })
            .filter((element) => element.url)
        : [];
      if (!css.length)
        css.push({
          id: crypto.randomUUID(),
          url: "https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css",
        });
      js = Array.isArray(js) ? js.filter(Boolean) : [];
      js = Array.isArray(js)
        ? js
            .map((element) => {
              let { id, url } = element || {};
              id = id || crypto.randomUUID();
              url = url || "";
              return { id, url };
            })
            .filter((element) => element.url)
        : [];
      if (!js.length) js.push({ id: crypto.randomUUID(), url: "" });
      style = String(style) === style ? style : "";
      script = String(script) === script ? script : "";
      const { yandex, metrika, google, analytics } = settings || {};
      settings = { yandex, metrika, google, analytics };
      set(index, { content, template, css, style, js, script, settings });
    }
  });
  const settings = computed({
    /**
     * чтение настроек
     *
     * @returns {object} настройки
     */
    get: () => (isDefined(index) ? get(index).settings : undefined),
    /**
     * запись настроек
     *
     * @param {object} value настройки
     */
    set(value) {
      get(index).settings = value;
    },
  });
  const script = computed({
    /**
     * чтение скрипта
     *
     * @returns {string} скрипт
     */
    get: () => (isDefined(index) ? get(index).script : undefined),
    /**
     * запись скрипта
     *
     * @param {string} value скрипт
     */
    set(value) {
      get(index).script = value;
    },
  });
  const style = computed({
    /**
     * чтение стилей
     *
     * @returns {string} стили
     */
    get: () => (isDefined(index) ? get(index).style : undefined),
    /**
     * запись стилей
     *
     * @param {string} value стили
     */
    set(value) {
      get(index).style = value;
    },
  });
  const js = computed({
    /**
     * чтение массива ссылок на скрипты
     *
     * @returns {Array} массив ссылок на скрипты
     */
    get: () => (isDefined(index) ? get(index).js : undefined),
    /**
     * запись массива ссылок на скрипты
     *
     * @param {Array} value массив ссылок на скрипты
     */
    set(value) {
      get(index).js = value.filter((element) => element.url);
    },
  });
  const css = computed({
    /**
     * чтение массива ссылок на стили
     *
     * @returns {Array} массив ссылок на стили
     */
    get: () => (isDefined(index) ? get(index).css : undefined),
    /**
     * запись массива ссылок на стили
     *
     * @param {Array} value массив ссылок на стили
     */
    set(value) {
      get(index).css = value.filter((element) => element.url);
    },
  });
  const template = computed({
    /**
     * чтение шаблона
     *
     * @returns {Array} шаблон
     */
    get: () => (isDefined(index) ? get(index).template : undefined),
    /**
     * запись шаблона
     *
     * @param {Array} value шаблон
     */
    set(value) {
      get(index).template = value;
    },
  });
  const content = computed({
    /**
     * чтение контента
     *
     * @returns {object} контент
     */
    get: () => (isDefined(index) ? get(index).content : undefined),
    /**
     * запись контента
     *
     * @param {object} value контент
     */
    set(value) {
      get(index).content = value;
    },
  });
  whenever(logicNot(s3), () => {
    set(index, undefined);
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
    index,
    (value, oldValue) => {
      if (value && oldValue)
        putObject("index.json", "application/json", JSON.stringify(value));
    },
    { deep: true, debounce: 1000, maxWait: 10000 }
  );
  return {
    ...{ bucket, wendpoint, base },
    ...{ panel, snackbar, message },
    ...{ content, template, js, script, css, style, settings },
    ...{ s3, putFile },
    ...{ calcLayer },
  };
});
