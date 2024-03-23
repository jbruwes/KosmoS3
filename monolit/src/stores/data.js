import { useFetch, whenever } from "@vueuse/core";
import { logicNot } from "@vueuse/math";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import Navbar from "~/src/assets/navbar.json";

/**
 * Путь, по которому происходит загрузка data.json
 *
 * @type {ref}
 */
const uri = ref();

const tree = ref();

const configurable = true;

const { data } = useFetch(
  () => (uri?.value !== null ? `${uri?.value}/data.json` : null),
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
      /** @type {object} */
      let { data: { navbar = {} } = {} } = ctx;

      navbar = (({
        theme = Navbar.theme,
        classes = Navbar.classes,
        scrollClasses = Navbar.scrollClasses,
        template = Navbar.template,
        script = Navbar.script,
        style = Navbar.style,
        setup = Navbar.setup,
        scoped = Navbar.scoped,
      }) => ({
        theme,
        classes,
        scrollClasses,
        template,
        script,
        style,
        setup,
        scoped,
      }))({ ...navbar });

      /** @type {Array} */
      let { data: { content = [] } = {} } = ctx;

      content = (([
        { id = crypto.randomUUID(), visible = true, label = "", template = "" },
      ]) => [{ ...(content?.[0] ?? {}), id, visible, label, template }])([
        ...content,
      ]);
      let {
        data: { settings = {} },
      } = ctx;
      settings = (({
        yandex = "",
        metrika = "",
        google = "",
        analytics = "",
        landing = true,
      }) => ({
        yandex,
        metrika,
        google,
        analytics,
        landing,
      }))({ ...settings });

      /** @type {string} */
      let { data: { style = "" } = {} } = ctx;

      style = String(style) === style ? style : "";

      /** @type {string} */
      let { data: { script = "" } = {} } = ctx;

      script = String(script) === script ? script : "";

      /** @type {Array} */
      let { data: { css = [] } = {} } = ctx;

      css = [...css]
        .filter(Boolean)
        .map(({ id = crypto.randomUUID(), url = "", visible = true }) => ({
          id,
          url,
          visible,
        }))
        .filter(({ url }) => url);
      if (!css.length)
        css = [{ id: crypto.randomUUID(), url: "", visible: true }];

      /** @type {Array} */
      let { data: { js = [] } = {} } = ctx;

      js = [...js]
        .filter(Boolean)
        .map(({ id = crypto.randomUUID(), url = "", visible = true }) => ({
          id,
          url,
          visible,
        }))
        .filter(({ url }) => url);
      if (!js.length)
        js = [{ id: crypto.randomUUID(), url: "", visible: true }];
      ctx.data = { navbar, content, settings, style, script, css, js };
      return ctx;
    },
    refetch: true,
  },
).json();
whenever(data, (value) => {
  tree.value = value;
});
whenever(logicNot(uri), () => {
  tree.value = undefined;
});
const settings = computed(() => tree?.value?.settings);
const script = computed({
  /**
   * Чтение скрипта
   *
   * @returns {string} Скрипт
   */
  get: () => tree?.value?.script,
  /**
   * Запись скрипта
   *
   * @param {string} value Скрипт
   */
  set(value) {
    if (tree?.value) tree.value.script = value;
  },
});
const style = computed({
  /**
   * Чтение стилей
   *
   * @returns {string} Стили
   */
  get: () => tree?.value?.style,
  /**
   * Запись стилей
   *
   * @param {string} value Стили
   */
  set(value) {
    if (tree?.value) tree.value.style = value;
  },
});
const index = {
  /** @returns {number} - Позиция в массиве одноуровневых объектов */
  get() {
    return this.siblings.findIndex(({ id }) => this.id === id);
  },
  configurable,
};
const prev = {
  /** @returns {Array} - Массив одноуровневых объектов */
  get() {
    return this.siblings[this.index - 1];
  },
  configurable,
};
const next = {
  /** @returns {Array} - Массив одноуровневых объектов */
  get() {
    return this.siblings[this.index + 1];
  },
  configurable,
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
    configurable,
  });
  Object.defineProperties(element, { index, prev, next });
  return element;
};
const js = computed(() => tree?.value?.js?.map(addProperties) ?? []);
const css = computed(() => tree?.value?.css?.map(addProperties) ?? []);
const content = computed(() => tree?.value?.content ?? []);
const navbar = computed(() => tree?.value?.navbar);
const siblings = {
  /** @returns {Array} - Массив одноуровневых объектов */
  get() {
    return this.parent ? this.parent?.children : [this];
  },
  configurable,
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
  configurable,
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
  configurable,
};
const urn = {
  /** @returns {string} - Путь до рекомендованный */
  get() {
    return (
      (this.loc ? encodeURI(this.loc?.replace(" ", "_")) : this.loc) ||
      this.path
    );
  },
  configurable,
};
const name = {
  /** @returns {string} - Вычисленное название страницы */
  get() {
    return this.title || this.label;
  },
  configurable,
};
const favicon = {
  /** @returns {string} - Вычисленное название иконки */
  get() {
    return this.icon?.replace(/-./g, (x) => x[1].toUpperCase());
  },
  configurable,
};

const cmpPrePages = computed(() =>
  (function getMembers(members, pParent) {
    const parent = {
      /** @returns {object} - Родительский объект */
      get() {
        return pParent;
      },
      configurable,
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
  })(content?.value),
);

const pages = computed(() => {
  /** @returns {Array} - Все вместе */
  const get = () => cmpPrePages?.value;
  return cmpPrePages?.value?.map((value) => {
    Object.defineProperty(value, "pages", { get, configurable });
    return value;
  });
});

export default defineStore("data", () => ({
  tree,
  uri,
  settings,
  script,
  js,
  style,
  css,
  content,
  navbar,
  pages,
}));
