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
  const style = computed({
    /**
     * Чтение стилей
     *
     * @returns {string} Стили
     */
    get: () => get(index)?.style,
    /**
     * Запись стилей
     *
     * @param {string} value Стили
     */
    set(value) {
      if (isDefined(index)) get(index).style = value;
    },
  });
  /**
   * @param {object} element
   * @param {number} i
   * @param {Array} array
   * @returns {object}
   */
  const addProperties = (element, i, array) => {
    Object.defineProperties(element, {
      siblings: {
        /** @returns {Array} - Массив одноуровневых объектов */
        get() {
          return array;
        },
        configurable: true,
      },
      index: {
        /** @returns {number} - Позиция в массиве одноуровневых объектов */
        get() {
          return this.siblings.findIndex(({ id }) => this.id === id);
        },
        configurable: true,
      },
      prev: {
        /** @returns {Array} - Массив одноуровневых объектов */
        get() {
          return this.siblings[this.index - 1];
        },
        configurable: true,
      },
      next: {
        /** @returns {Array} - Массив одноуровневых объектов */
        get() {
          return this.siblings[this.index + 1];
        },
        configurable: true,
      },
    });
    return element;
  };
  const js = computed(() => get(index)?.js.map(addProperties));
  const css = computed(() => get(index)?.css.map(addProperties));

  const content = computed({
    /**
     * Чтение контента
     *
     * @returns {object} Контент
     */
    get: () => get(index)?.content,
    /**
     * Запись контента
     *
     * @param {object} value Контент
     */
    set(value) {
      if (isDefined(index)) get(index).content = value;
    },
  });
  const list = computed(() =>
    (function getMembers(members, pParent) {
      return members.reduce((accumulator, current) => {
        Object.defineProperties(current, {
          parent: {
            /** @returns {object} - Родительский объект */
            get() {
              return pParent;
            },
            configurable: true,
          },
          siblings: {
            /** @returns {Array} - Массив одноуровневых объектов */
            get() {
              return this.parent ? this.parent?.children : [this];
            },
            configurable: true,
          },
          index: {
            /** @returns {number} - Позиция в массиве одноуровневых объектов */
            get() {
              return this.siblings.findIndex(({ id }) => this.id === id);
            },
            configurable: true,
          },
          prev: {
            /** @returns {Array} - Массив одноуровневых объектов */
            get() {
              return this.siblings[this.index - 1];
            },
            configurable: true,
          },
          next: {
            /** @returns {Array} - Массив одноуровневых объектов */
            get() {
              return this.siblings[this.index + 1];
            },
            configurable: true,
          },
          branch: {
            /** @returns {Array} - Массив родительских объектов */
            get() {
              const branch = [this];
              let { parent } = this;
              while (parent) {
                branch.unshift(parent);
                ({ parent } = parent);
              }
              return branch;
            },
            configurable: true,
          },
          path: {
            /** @returns {string} - Путь до объекта */
            get() {
              return this.branch
                .map(({ label }) => encodeURIComponent(label))
                .slice(1)
                .join("/");
            },
            configurable: true,
          },
        });
        return current.children?.length
          ? [...accumulator, ...getMembers(current.children, current)]
          : accumulator;
      }, members);
    })(get(content) ?? [{}]),
  );

  return {
    index,
    path,
    settings,
    script,
    js,
    style,
    css,
    content,
    list,
    calcIndex,
  };
});
