import {
  get,
  isDefined,
  set,
  useArrayMap,
  useFetch,
  whenever,
} from "@vueuse/core";
import { logicNot } from "@vueuse/math";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import defNavbar from "~/src/assets/navbar.json";

export default defineStore("data", () => {
  const uri = ref();

  const tree = ref();

  /**
   * Удаление лишнего из настроек
   *
   * @param {object} settings - Грязные настройки
   * @param {string} settings.yandex - Яндекс
   * @param {string} settings.metrika - Метрика
   * @param {string} settings.google - Гугл
   * @param {string} settings.analytics - Аналитика
   * @param settings.landing
   * @returns {object} - Чистые настройки
   */
  const fixSettings = ({
    yandex = "",
    metrika = "",
    google = "",
    analytics = "",
    landing = true,
  } = {}) => ({
    yandex,
    metrika,
    google,
    analytics,
    landing,
  });

  /**
   * Удаление лишнего из навбвра
   *
   * @param {object} navbar - Гразный навбар
   * @param {string} navbar.theme
   * @param {Array} navbar.classes
   * @param {Array} navbar.scrollClasses
   * @param {string} navbar.template
   * @param {string} navbar.script
   * @param {string} navbar.style
   * @param {boolean} navbar.setup
   * @param {boolean} navbar.scoped
   * @returns {object} - Чистый навбар
   */
  const fixNavbar = ({
    theme = defNavbar.theme,
    classes = defNavbar.classes,
    scrollClasses = defNavbar.scrollClasses,
    template = defNavbar.template,
    script = defNavbar.script,
    style = defNavbar.style,
    setup = defNavbar.setup,
    scoped = defNavbar.scoped,
  } = {}) => ({
    theme,
    classes,
    scrollClasses,
    template,
    script,
    style,
    setup,
    scoped,
  });

  /**
   * Проверка структуры сайта
   *
   * @param {object} tree - Структура сайта
   * @param {object} tree.content - Контент
   * @param {object} tree.navbar - Навбар
   * @param {Array} tree.css - Ссылки на стили
   * @param {string} tree.style - Стили
   * @param {Array} tree.js - Ссылки на скрипты
   * @param {string} tree.script - Скрипт
   * @param {object} tree.settings - Настройки
   * @returns {object} - Структура сайта
   */
  const calcIndex = ({
    content: pContent = [],
    navbar: pNavbar = {},
    css: pCss = [],
    style: pStyle = "",
    js: pJs = [],
    script: pScript = "",
    settings: pSettings = {},
  } = {}) => {
    let [content = {}] = pContent;
    let navbar = { ...pNavbar };
    let css = [...pCss].filter(Boolean);
    let style = pStyle;
    let js = [...pJs].filter(Boolean);
    let script = pScript;
    let settings = { ...pSettings };
    css = Array.isArray(css)
      ? css
          .map(({ id = crypto.randomUUID(), url = "", visible = true }) => ({
            id,
            url,
            visible,
          }))
          .filter(({ url }) => url)
      : [];
    if (!css.length)
      css.push({ id: crypto.randomUUID(), url: "", visible: true });
    js = Array.isArray(js)
      ? js
          .map(({ id = crypto.randomUUID(), url = "", visible = true }) => ({
            id,
            url,
            visible,
          }))
          .filter(({ url }) => url)
      : [];
    if (!js.length)
      js.push({ id: crypto.randomUUID(), url: "", visible: true });
    const {
      id = crypto.randomUUID(),
      visible = true,
      label = "",
      template = "",
    } = content;
    navbar = fixNavbar(navbar);
    content = [{ ...content, id, visible, label, template }];
    style = String(style) === style ? style : "";
    script = String(script) === script ? script : "";
    settings = fixSettings(settings);
    return { content, navbar, css, style, js, script, settings };
  };
  const { data } = useFetch(
    () => (isDefined(uri) ? `${get(uri)}/data.json` : undefined),
    {
      /**
       * Добавляем no-cache
       *
       * @param {object} ctx - Контекстный объект
       * @param {object} ctx.options - Свойства запроса
       * @param {string} ctx.url - Урл
       * @param {Function} ctx.cancel - Ф-ция отмены запроса
       * @returns {object} - Трансформированный контекстный объект
       */
      beforeFetch({ url, options, cancel }) {
        if (!url) cancel();
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
       * @param {object} ctx - Контекстный объект
       * @returns {object} - Трансформированный контекстный объект
       */
      afterFetch(ctx) {
        ctx.data = calcIndex(ctx.data);
        return ctx;
      },
      refetch: true,
    },
  ).json();
  whenever(data, (value) => {
    set(tree, value);
  });
  whenever(logicNot(uri), () => {
    set(tree, undefined);
  });
  const settings = computed(() => get(tree)?.settings);
  const script = computed({
    /**
     * Чтение скрипта
     *
     * @returns {string} Скрипт
     */
    get: () => get(tree)?.script,
    /**
     * Запись скрипта
     *
     * @param {string} value Скрипт
     */
    set(value) {
      if (isDefined(tree)) get(tree).script = value;
    },
  });
  const style = computed({
    /**
     * Чтение стилей
     *
     * @returns {string} Стили
     */
    get: () => get(tree)?.style,
    /**
     * Запись стилей
     *
     * @param {string} value Стили
     */
    set(value) {
      if (isDefined(tree)) get(tree).style = value;
    },
  });
  const index = {
    /** @returns {number} - Позиция в массиве одноуровневых объектов */
    get() {
      return this.siblings.findIndex(({ id }) => this.id === id);
    },
    configurable: true,
  };
  const prev = {
    /** @returns {Array} - Массив одноуровневых объектов */
    get() {
      return this.siblings[this.index - 1];
    },
    configurable: true,
  };
  const next = {
    /** @returns {Array} - Массив одноуровневых объектов */
    get() {
      return this.siblings[this.index + 1];
    },
    configurable: true,
  };
  /**
   * @param {object} element - Объект для добавления новых свойств
   * @param {number} i - Порядковый номер в массиве
   * @param {Array} array - Исходный массив
   * @returns {object} - Объект с новыми свойствами
   */
  const addProperties = (element, i, array) => {
    Object.defineProperty(element, "siblings", {
      /** @returns {Array} - Массив одноуровневых объектов */
      get() {
        return array;
      },
      configurable: true,
    });
    Object.defineProperties(element, { index, prev, next });
    return element;
  };
  const js = computed(() => get(tree)?.js?.map(addProperties) ?? []);
  const css = computed(() => get(tree)?.css?.map(addProperties) ?? []);
  const content = computed(() => get(tree)?.content ?? []);
  const navbar = computed(() => get(tree)?.navbar);
  const siblings = {
    /** @returns {Array} - Массив одноуровневых объектов */
    get() {
      return this.parent ? this.parent?.children : [this];
    },
    configurable: true,
  };
  const branch = {
    /** @returns {Array} - Массив родительских объектов */
    get() {
      const ret = [this];
      let { parent } = this;
      while (parent) {
        ret.unshift(parent);
        ({ parent } = parent);
      }
      return ret;
    },
    configurable: true,
  };
  const path = {
    /** @returns {string} - Путь до объекта */
    get() {
      return this.branch
        .map(
          ({ label, id }) => encodeURIComponent(label?.replace(" ", "_")) || id,
        )
        .slice(1)
        .join("/");
    },
    configurable: true,
  };
  const urn = {
    /** @returns {string} - Путь до рекомендованный */
    get() {
      return (
        (this.loc ? encodeURI(this.loc?.replace(" ", "_")) : this.loc) ||
        this.path
      );
    },
    configurable: true,
  };
  const name = {
    /** @returns {string} - Вычисленное название страницы */
    get() {
      return this.title || this.label;
    },
    configurable: true,
  };
  const favicon = {
    /** @returns {string} - Вычисленное название иконки */
    get() {
      return this.icon?.replace(/-./g, (x) => x[1].toUpperCase());
    },
    configurable: true,
  };

  const cmpPrePages = computed(() =>
    (function getMembers(members, pParent) {
      const parent = {
        /** @returns {object} - Родительский объект */
        get() {
          return pParent;
        },
        configurable: true,
      };
      return members.reduce((accumulator, current) => {
        const lCurrent = current;
        const referen = {
          changefreq: undefined,
          children: [],
          description: undefined,
          icon: undefined,
          id: crypto.randomUUID(),
          image: undefined,
          keywords: undefined,
          label: "",
          lastmod: undefined,
          loc: undefined,
          priority: undefined,
          template: undefined,
          script: undefined,
          style: undefined,
          theme: "light",
          title: undefined,
          visible: true,
          edit: false,
          type: "website",
          alt: undefined,
          full: true,
          setup: true,
          scoped: true,
        };
        Object.keys(current).forEach((key) => {
          if (!Object.keys(referen).includes(key)) delete lCurrent[key];
        });
        Object.entries(referen)
          .filter(([, value]) => value !== undefined)
          .forEach(([key, value]) => {
            if (current[key] === undefined) lCurrent[key] = value;
          });
        Object.defineProperties(current, {
          parent,
          siblings,
          branch,
          path,
          index,
          prev,
          next,
          name,
          urn,
          favicon,
        });
        return current.children?.length
          ? [...accumulator, ...getMembers(current.children, current)]
          : accumulator;
      }, members);
    })(get(content)),
  );

  const pages = {
    /** @returns {Array} - Все вместе */
    get: () => get(cmpPrePages),
    configurable: true,
  };

  const cmpPages = useArrayMap(cmpPrePages, (value) => {
    Object.defineProperty(value, "pages", pages);
    return value;
  });

  return {
    tree,
    uri,
    settings,
    script,
    js,
    style,
    css,
    content,
    navbar,
    cmpPages,
    calcIndex,
  };
});
