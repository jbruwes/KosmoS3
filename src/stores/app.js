import { get, set, useFetch, watchDebounced, whenever } from "@vueuse/core";
import { logicAnd, logicNot } from "@vueuse/math";
import { defineStore, storeToRefs } from "pinia";
import { uid } from "quasar";
import { ref } from "vue";

import storeS3 from "./s3";

export default defineStore("app", () => {
  const store = storeS3();
  const { bucket, S3 } = storeToRefs(store);
  const { putObject, getObject, headObject } = store;
  /**
   * Переключатель видимости правой панели
   *
   * @type {boolean}
   */
  const rightDrawer = ref(null);
  const index = ref();
  const { data } = useFetch("monolit/.vite/manifest.json", {
    /**
     * Преводим в массив
     *
     * @param {object} ctx - Возвращаемый объект
     * @returns {object} - Трансформируемый возвращаемый объект
     */
    afterFetch(ctx) {
      ctx.data = [
        "index.html",
        ...Object.values(ctx.data).map(({ file }) => file),
      ];
      return ctx;
    },
  }).json();
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
  whenever(S3, async () => {
    let json = {};
    try {
      json = JSON.parse((await getObject("data.json")) || "{}");
    } finally {
      set(index, calcIndex(json));
    }
  });
  whenever(logicNot(S3), () => {
    set(index, undefined);
  });
  whenever(logicAnd(S3, data), () => {
    /** @param {string} pAsset - Путь до файла ресурса */
    const headPutObject = async (pAsset) => {
      try {
        if (pAsset === "index.html") throw new Error();
        await headObject(pAsset);
      } catch (e) {
        const { data: body } = await useFetch(`monolit/${pAsset}`).blob();
        putObject(pAsset, get(body).type, get(body));
      }
    };
    get(data).reduce(async (promise, asset) => {
      await promise;
      await headPutObject(asset);
    }, Promise.resolve());
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
  return { index, rightDrawer };
});
