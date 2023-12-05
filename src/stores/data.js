import { get, isDefined, set, useFetch, whenever } from "@vueuse/core";
import { logicNot } from "@vueuse/math";
import { defineStore } from "pinia";
import { uid } from "quasar";
import { computed, ref, watch } from "vue";

export default defineStore("data", () => {
  const path = ref();
  const index = ref();
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
    const { id = uid(), visible = true, label = "", html = "" } = content;
    content = [{ ...content, id, visible, label, html }];
    style = String(style) === style ? style : "";
    script = String(script) === script ? script : "";
    const { yandex, metrika, google, analytics } = settings;
    settings = { yandex, metrika, google, analytics };
    return { content, css, style, js, script, settings };
  };
  const uri = computed(() =>
    isDefined(path) ? `${get(path)}data.json` : undefined,
  );
  const { /* isFetching, */ data } = useFetch(uri, {
    /**
     * Добавляем no-cache
     *
     * @param {object} ctx
     * @param {object} ctx.options
     * @returns {object}
     */
    beforeFetch({ options }) {
      const ret = options;
      ret.headers = {
        ...ret.headers,
        "cache-control": "no-cache",
      };
      return { ret };
    },
    /**
     * Преводим в массив
     *
     * @param {object} ctx - Возвращаемый объект
     * @returns {object} - Трансформируемый возвращаемый объект
     */
    afterFetch(ctx) {
      ctx.data = calcIndex(ctx.data);
      return ctx;
    },
    refetch: true,
  }).json();
  watch(data, (value) => {
    set(index, value);
  });
  whenever(logicNot(path), () => {
    set(index, undefined);
  });
  const settings = computed({
    /**
     * Чтение настроек
     *
     * @returns {object} Настройки
     */
    get: () => get(index)?.settings,
    /**
     * Запись настроек
     *
     * @param {object} value Настройки
     */
    set(value) {
      if (isDefined(index)) get(index).settings = value;
    },
  });
  const script = computed({
    /**
     * Чтение скрипта
     *
     * @returns {string} Скрипт
     */
    get: () => get(index)?.script,
    /**
     * Запись скрипта
     *
     * @param {string} value Скрипт
     */
    set(value) {
      if (isDefined(index)) get(index).script = value;
    },
  });
  const js = computed({
    /**
     * Чтение массива ссылок на скрипты
     *
     * @returns {Array} Массив ссылок на скрипты
     */
    get: () => get(index)?.js,
    /**
     * Запись массива ссылок на скрипты
     *
     * @param {Array} value Массив ссылок на скрипты
     */
    set(value) {
      if (isDefined(index)) get(index).js = value.filter(({ url }) => url);
    },
  });
  return { index, path, settings, script, js, calcIndex };
});
