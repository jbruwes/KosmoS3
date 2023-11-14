import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  get,
  isDefined,
  set,
  useFetch,
  watchDebounced,
  whenever,
} from "@vueuse/core";
import { logicAnd, logicNot } from "@vueuse/math";
import { defineStore } from "pinia";
import { uid } from "quasar";
import { computed, ref } from "vue";

export default defineStore("app", () => {
  /**
   * Переключатель видимости правой панели
   *
   * @type {boolean}
   */
  const rightDrawer = ref(null);
  /**
   * Корзина в сервисе s3
   *
   * @type {string}
   */
  const bucket = ref("");
  /**
   * Путь к сайту через сервис s3
   *
   * @type {string}
   */
  const wendpoint = ref("");
  /**
   * Клиент к сервису s3
   *
   * @type {object}
   */
  const s3 = ref();
  /**
   * Индекс сайта
   *
   * @type {object}
   */
  const index = ref();
  /**
   * Считывание заголовка файла
   *
   * @param {string} Key Имя файла
   * @returns {object} Заголовок файла
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
   * @param {string} Key Имя файла
   * @param {string} ContentType Тип mime
   * @param {string | Uint8Array | Buffer} body Тело файла
   */
  const putObject = async (Key, ContentType, body) => {
    const Bucket = get(bucket);
    const Body =
      typeof body === "string" ? new TextEncoder().encode(body) : body;
    if (isDefined(s3))
      await get(s3).send(
        new PutObjectCommand({ Bucket, Key, ContentType, Body }),
      );
  };
  /**
   * Запись файла
   *
   * @param {string} Key Имя файла
   * @param {string} ContentType Тип mime
   * @param {File} file Файл
   */
  const putFile = async (Key, ContentType, file) => {
    await putObject(Key, ContentType, await file.arrayBuffer());
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
        new GetObjectCommand({ ResponseCacheControl, Bucket, Key }),
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
  const requiredFiles = ["index.html", "favicon.ico"];
  const { data } = useFetch("monolit/manifest.json", {
    /**
     * Преводим в массив
     *
     * @param {object} ctx - Возвращаемый объект
     * @returns {object} - Трансформируемый возвращаемый объект
     */
    afterFetch(ctx) {
      ctx.data = [
        ...requiredFiles,
        ...Object.values(ctx.data).map(({ file }) => file),
      ];
      return ctx;
    },
  }).json();
  const base = computed(
    () =>
      `${isDefined(wendpoint) ? get(wendpoint) : "htpps:/"}/${get(bucket)}/`,
  );
  /**
   * Проверка структуры сайта
   *
   * @param {object} index - Структура сайта
   * @param {object} index.content - Контент
   * @param {Array} index.css - Ссылки на стили
   * @param {string} index.style - Стили
   * @param {Array} index.js - Ссылки на скрипты
   * @param {string} index.script - Скрипт
   * @param {object} index.settings - Настройки
   * @returns {object} - Структура сайта
   */
  const calcIndex = ({
    content: pContent = [],
    css: pCss = [],
    style: pStyle = "",
    js: pJs = [],
    script: pScript = "",
    settings: pSettings = {},
  } = {}) => {
    let [content = {}] = pContent;
    let css = [...pCss].filter(Boolean);
    let style = pStyle;
    let js = [...pJs].filter(Boolean);
    let script = pScript;
    let settings = { ...pSettings };
    css = Array.isArray(css)
      ? css
          .map(({ id = uid(), url = "", visible = true }) => ({
            id,
            url,
            visible,
          }))
          .filter(({ url }) => url)
      : [];
    if (!css.length) css.push({ id: uid(), url: "", visible: true });
    js = Array.isArray(js)
      ? js
          .map(({ id = uid(), url = "", visible = true }) => ({
            id,
            url,
            visible,
          }))
          .filter(({ url }) => url)
      : [];
    if (!js.length) js.push({ id: uid(), url: "", visible: true });
    const {
      id = uid(),
      visible = true,
      label = get(bucket),
      html = "",
    } = content;
    content = [{ ...content, id, visible, label, html }];
    style = String(style) === style ? style : "";
    script = String(script) === script ? script : "";
    const { yandex, metrika, google, analytics } = settings;
    settings = { yandex, metrika, google, analytics };
    return { content, css, style, js, script, settings };
  };
  whenever(s3, async () => {
    let json = {};
    try {
      json = JSON.parse((await getObject("data.json")) || "{}");
    } finally {
      set(index, calcIndex(json));
    }
  });
  whenever(logicNot(s3), () => {
    set(index, undefined);
  });
  whenever(logicAnd(s3, data), () => {
    /** @param {string} pAsset - Путь до файла ресурса */
    const headPutObject = async (pAsset) => {
      try {
        const head = await headObject(pAsset);
        if (requiredFiles.includes(pAsset)) throw new Error(head.ContentLength);
      } catch (e) {
        const byteLength = +e.message;
        const { data: body } = await useFetch(`monolit/${pAsset}`).blob();
        let lBody = null;
        if (Number.isNaN(byteLength)) lBody = get(body);
        else {
          const blob = new Blob(
            [(await get(body).text()).replace(/{{ domain }}/g, get(bucket))],
            { type: get(body).type },
          );
          if (byteLength !== (await blob.arrayBuffer()).byteLength)
            lBody = blob;
        }
        if (lBody) putObject(pAsset, lBody.type, lBody);
      }
    };
    get(data).forEach((asset) => {
      headPutObject(asset);
    });
  });
  watchDebounced(
    index,
    (value, oldValue) => {
      if (value && oldValue)
        putObject(
          "data.json",
          "application/json",
          JSON.stringify(calcIndex(value)),
        );
    },
    { deep: true, debounce: 1000, maxWait: 10000 },
  );
  return {
    ...{ bucket, wendpoint, base },
    ...{ index },
    ...{ s3, putFile },
    ...{ rightDrawer },
  };
});
