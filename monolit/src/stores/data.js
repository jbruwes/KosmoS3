import { useFetch, whenever } from "@vueuse/core";
import { logicNot } from "@vueuse/math";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import Data from "~/src/assets/data.json";
import Navbar from "~/src/assets/navbar.json";
import Page from "~/src/assets/page.json";
import Settings from "~/src/assets/settings.json";

/**
 * Путь, по которому происходит загрузка data.json
 *
 * @type {ref}
 */
const uri = ref();

const tree = ref();

const configurable = true;
const writable = true;
const enumerable = true;

/**
 * Приведение структуры объекта в соответствие с дефолтным
 *
 * @param {object} obj - Объект
 * @param {object} def - Эталонный объект
 */
const fixer = (obj = {}, def = {}) => {
  Object?.keys(obj)?.forEach((key) => {
    if (!Object?.keys(def)?.includes(key))
      Object?.defineProperty(obj, key, { configurable });
  });
  Object?.entries(def)?.forEach(
    ([key = null, { type = null, value = null } = {}] = []) => {
      if (obj?.[key]?.constructor?.name !== type && obj?.[key] !== value)
        Object?.defineProperty(obj, key, {
          value,
          writable,
          configurable,
          enumerable,
        });
    },
  );
};

/**
 * Добавляем no-cache
 *
 * @param {object} ctx - Контекстный объект
 * @param {object} ctx.options - Свойства запроса
 * @param {string} ctx.url - Урл
 * @param {Function} ctx.cancel - Ф-ция отмены запроса
 * @returns {object} - Трансформированный контекстный объект
 */
const beforeFetch = ({ url, options, cancel }) => {
  if (!url) cancel();
  const ret = options;
  ret.headers = {
    ...ret.headers,
    "cache-control": "no-cache",
  };
  return { ret };
};

/**
 * Преводим в массив
 *
 * @param {object} ctx - Контекстный объект
 * @returns {object} - Трансформированный контекстный объект
 */
const afterFetch = (ctx) => {
  const { data = {} } = ctx;
  fixer(data, Data);
  const {
    navbar = {},
    content = [],
    settings = {},
    style = "",
    script = "",
  } = data;
  let { css = [], js = [] } = data;
  fixer(navbar, Navbar);
  fixer(settings, Settings);
  css = css
    .filter(({ constructor = null } = {}) => constructor === Object)
    .map(({ id = crypto.randomUUID(), url = "", visible = true } = {}) => ({
      id,
      url,
      visible,
    }))
    .filter(({ url }) => url);
  if (!css.length) css = [{ id: crypto.randomUUID(), url: "", visible: true }];
  js = js
    .filter(({ constructor = null } = {}) => constructor === Object)
    .map(({ id = crypto.randomUUID(), url = "", visible = true } = {}) => ({
      id,
      url,
      visible,
    }))
    .filter(({ url }) => url);
  if (!js.length) js = [{ id: crypto.randomUUID(), url: "", visible: true }];
  ctx.data = { navbar, content, settings, style, script, css, js };
  return ctx;
};

const refetch = true;

const { data } = useFetch(
  () => (uri?.value !== null ? `${uri?.value}/data.json` : null),
  { beforeFetch, afterFetch, refetch },
).json();
whenever(data, (value) => {
  tree.value = value;
});
whenever(logicNot(uri), () => {
  tree.value = undefined;
});
const settings = computed(() => tree?.value?.settings ?? {});

const index = {
  /** @returns {number} - Позиция в массиве одноуровневых объектов */
  get() {
    return this?.siblings?.findIndex(({ id } = {}) => this?.id === id);
  },
  configurable,
};
const prev = {
  /** @returns {Array} - Массив одноуровневых объектов */
  get() {
    return this?.siblings?.[this.index - 1];
  },
  configurable,
};
const next = {
  /** @returns {Array} - Массив одноуровневых объектов */
  get() {
    return this?.siblings?.[this.index + 1];
  },
  configurable,
};
/**
 * @param {object} element - Объект для добавления новых свойств
 * @param {number} i - Порядковый номер в массиве
 * @param {Array} value - Исходный массив
 * @returns {object} - Объект с новыми свойствами
 */
const addProperties = (element, i, value = []) => {
  Object?.defineProperty(element, "siblings", {
    value,
    configurable,
  });
  Object.defineProperties(element, { index, prev, next });
  return element;
};
const js = computed(() => tree?.value?.js?.map(addProperties) ?? []);
const css = computed(() => tree?.value?.css?.map(addProperties) ?? []);
const content = computed(() => tree?.value?.content ?? []);
const navbar = computed(() => tree?.value?.navbar ?? {});
const siblings = {
  /** @returns {Array} - Массив одноуровневых объектов */
  get() {
    return this?.parent ? this?.parent?.children : [this];
  },
  configurable,
};
const branch = {
  /** @returns {Array} - Массив родительских объектов */
  get() {
    const ret = [this];
    let { parent } = this;
    while (parent) {
      ret?.unshift(parent);
      ({ parent } = parent);
    }
    return ret;
  },
  configurable,
};
const path = {
  /** @returns {string} - Путь до объекта */
  get() {
    return this?.branch
      ?.map(
        ({ label, id } = {}) =>
          encodeURIComponent(label?.replace(" ", "_") ?? "") || id,
      )
      ?.slice(1)
      ?.join("/");
  },
  configurable,
};
const urn = {
  /** @returns {string} - Путь до рекомендованный */
  get() {
    return (
      (this?.loc ? encodeURI(this?.loc?.replace(" ", "_") ?? "") : this?.loc) ||
      this?.path
    );
  },
  configurable,
};
const name = {
  /** @returns {string} - Вычисленное название страницы */
  get() {
    return this?.title ?? this?.label ?? "";
  },
  configurable,
};
const favicon = {
  /** @returns {string} - Вычисленное название иконки */
  get() {
    return this?.icon?.replace(/-./g, (x = []) => x?.[1]?.toUpperCase());
  },
  configurable,
};

const type = "String";

/**
 * Рекурсивная функция рассчета массива страниц
 *
 * @type {Function}
 * @param {Array} pages - Элементы массива страниц
 * @param {object} parent - Родительский объект
 * @returns {Array} - Аддитивный массив страниц
 */
const getPages = (pages = [], parent = {}) =>
  pages?.reduce((accumulator = [], value = {}) => {
    const id = { value: crypto?.randomUUID(), type };
    fixer(value, { id, ...Page });
    Object?.defineProperties(value, {
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
    return value?.children?.length
      ? [...accumulator, ...getPages(value?.children, { value, configurable })]
      : accumulator;
  }, pages);

/**
 * Функция для вызова рассчета массива страниц
 *
 * @returns {Array} - Страницы
 */
const get = () => getPages(content?.value);

const pages = computed(() =>
  get()?.map((value = {}) => {
    Object?.defineProperty(value, "pages", { get, configurable });
    return value;
  }),
);

const script = computed({
  /**
   * Чтение скрипта
   *
   * @returns {string} Скрипт
   */
  get() {
    return tree?.value?.script;
  },
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
  get() {
    return tree?.value?.style;
  },
  /**
   * Запись стилей
   *
   * @param {string} value Стили
   */
  set(value) {
    if (tree?.value) tree.value.style = value;
  },
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
