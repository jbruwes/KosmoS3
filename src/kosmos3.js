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
import DOMPurify from "dompurify";

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
  const configDOMPurify = {
    SAFE_FOR_TEMPLATES: true,
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "target",
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
    ],
    CUSTOM_ELEMENT_HANDLING: {
      tagNameCheck: /^v-/,
      attributeNameCheck: /\w+/,
      allowCustomizedBuiltInElements: true,
    },
  };
  /**
   * проверка слоя
   *
   * @param {object} layer слой
   * @param {string} layer.id уникальный идентификатор
   * @param {string} layer.fill цвет заливки
   * @param {string} layer.name имя
   * @param {boolean} layer.visible видимость слоя
   * @param {object} layer.params параметры
   * @param {string} layer.params.position вид позиционирования
   * @param {string} layer.params.responsive адаптивность
   * @param {Array} layer.params.width параметры ширины
   * @param {Array} layer.params.height параметры высоты
   * @param {string} layer.params.value html
   * @returns {object} слой
   */
  const calcLayer = ({
    id = crypto.randomUUID(),
    fill = Konva.Util.getRandomColor(),
    name = "",
    visible = true,
    params: { position, responsive, width, height, value = "" } = {},
  } = {}) => ({
    opacity: 0.5,
    draggable: true,
    width: 1,
    height: 1,
    offsetX: 0.5,
    offsetY: 0.5,
    id,
    fill,
    name,
    visible: !!visible,
    params: {
      edit: false,
      position: +position || 0,
      responsive: !!responsive,
      width: Array.isArray(width)
        ? width.map((element) => Math.round(element))
        : [0, 100],
      height: Array.isArray(height)
        ? height.map((element) => Math.round(element))
        : [0, 100],
      value:
        name === "content" ? "" : DOMPurify.sanitize(value, configDOMPurify),
    },
  });
  /**
   * проверка структуры сайта
   *
   * @param {object} index структура сайта
   * @param {object} index.content контент
   * @param {Array} index.template шаблон
   * @param {Array} index.css ссылки на стили
   * @param {string} index.style стили
   * @param {Array} index.js ссылки на скрипты
   * @param {string} index.script скрипт
   * @param {object} index.settings настройки
   * @returns {object} структура сайта
   */
  const calcIndex = ({
    content: pContent = {},
    template: pTemplate = [],
    css: pCss = [],
    style: pStyle = "",
    js: pJs = [],
    script: pScript = "",
    settings: pSettings = {},
  } = {}) => {
    let content = { ...pContent };
    let template = [...pTemplate];
    let css = [...pCss];
    let style = pStyle;
    let js = [...pJs];
    let script = pScript;
    let settings = { ...pSettings };
    template = Array.isArray(template) ? template.filter(Boolean) : [];
    if (!template.find(({ name }) => name === "content"))
      template.push({ name: "content" });
    template = template.map((element) => calcLayer(element));
    css = Array.isArray(css)
      ? css
          .map(({ id = crypto.randomUUID(), url = "" }) => ({ id, url }))
          .filter(({ url }) => url)
      : [];
    if (!css.length)
      css.push({
        id: crypto.randomUUID(),
        url: "https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css",
      });
    js = Array.isArray(js)
      ? js
          .map(({ id = crypto.randomUUID(), url = "" }) => ({ id, url }))
          .filter(({ url }) => url)
      : [];
    if (!js.length) js.push({ id: crypto.randomUUID(), url: "" });
    const {
      id = crypto.randomUUID(),
      value = get(bucket),
      visible = true,
    } = content;
    content = {
      ...content,
      id,
      value,
      visible,
    };
    style = String(style) === style ? style : "";
    script = String(script) === script ? script : "";
    const { yandex, metrika, google, analytics } = settings;
    settings = { yandex, metrika, google, analytics };
    return { content, template, css, style, js, script, settings };
  };
  whenever(s3, async () => {
    let json = {};
    try {
      json = JSON.parse(await getObject("index.json"));
    } finally {
      set(index, calcIndex(json));
    }
  });
  const settings = computed({
    /**
     * чтение настроек
     *
     * @returns {object} настройки
     */
    get: () => (isDefined(index) ? get(index).settings : {}),
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
    get: () => (isDefined(index) ? get(index).script : ""),
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
    get: () => (isDefined(index) ? get(index).style : ""),
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
    get: () => (isDefined(index) ? get(index).js : []),
    /**
     * запись массива ссылок на скрипты
     *
     * @param {Array} value массив ссылок на скрипты
     */
    set(value) {
      get(index).js = value.filter(({ url }) => url);
    },
  });
  const css = computed({
    /**
     * чтение массива ссылок на стили
     *
     * @returns {Array} массив ссылок на стили
     */
    get: () => (isDefined(index) ? get(index).css : []),
    /**
     * запись массива ссылок на стили
     *
     * @param {Array} value массив ссылок на стили
     */
    set(value) {
      get(index).css = value.filter(({ url }) => url);
    },
  });
  const template = computed({
    /**
     * чтение шаблона
     *
     * @returns {Array} шаблон
     */
    get: () => (isDefined(index) ? get(index).template : []),
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
    get: () => (isDefined(index) ? get(index).content : {}),
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
        putObject(
          "index.json",
          "application/json",
          JSON.stringify(calcIndex(value))
        );
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
