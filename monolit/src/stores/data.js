import { syncRef, useFetch } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import Data from "~/src/assets/data.json";
import Navbar from "~/src/assets/navbar.json";
import Page from "~/src/assets/page.json";
import Resource from "~/src/assets/resource.json";
import Settings from "~/src/assets/settings.json";

/**
 * Путь, по которому происходит загрузка data.json
 *
 * @type {ref}
 */
const uri = ref();

/**
 * Равен true только в том случае, если тип этого дескриптора свойства может
 * быть изменён и если свойство может быть удалено из содержащего его объекта.
 *
 * @type {boolean}
 */
const configurable = true;

/**
 * Равен true только в том случае, если значение, ассоциированное со свойством,
 * может быть изменено с помощью оператора присваивания.
 *
 * @type {boolean}
 */

const writable = true;

/**
 * Равен true только в том случае, если это свойство можно увидеть через
 * перечисление свойств содержащего его объекта.
 *
 * @type {boolean}
 */
const enumerable = true;

/**
 * Refetching on URL change. Using a ref for the url parameter will allow the
 * useFetch function to automatically trigger another request when the url is
 * changed.
 *
 * @type {boolean}
 */
const refetch = true;

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
    ([key = "", { type = "", value = null } = {}] = []) => {
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
 * Тип для вычисляемого id
 *
 * @type {string}
 */
const type = "String";

/**
 * Объект, на котором определяется свойство позиции в соседних объектах
 *
 * @type {object}
 */
const index = {
  /**
   * Геттер позиции в соседних объектах
   *
   * @returns {number} - Позиция в соседних объектах
   */
  get() {
    return this?.siblings?.findIndex(({ id = "" } = {}) => this?.id === id);
  },
  configurable,
};

/**
 * Объект, на котором определяется свойство предыдущего объекта
 *
 * @type {object}
 */
const prev = {
  /**
   * Геттер предыдущего объекта
   *
   * @returns {object} - Предыдущий объект
   */
  get() {
    return this?.siblings?.[this.index - 1] ?? null;
  },
  configurable,
};

/**
 * Объект, на котором определяется свойство следующего объекта
 *
 * @type {object}
 */
const next = {
  /**
   * Геттер следующего объекта
   *
   * @returns {object} - Следующий объект
   */
  get() {
    return this?.siblings?.[this.index + 1] ?? null;
  },
  configurable,
};

/**
 * Объект, на котором определяется свойство массива соседних объектов
 *
 * @type {object}
 */
const siblings = {
  /**
   * Геттер массива соседних объектов
   *
   * @returns {Array} - Массив соседних объектов
   */
  get() {
    return this?.parent ? this?.parent?.children : [this];
  },
  configurable,
};

/**
 * Объект, на котором определяется свойство ветви объектов
 *
 * @type {object}
 */
const branch = {
  /**
   * Геттер ветви объектов
   *
   * @returns {Array} - Ветвь объектов
   */
  get() {
    /**
     * Результирующий массив для записи ветви
     *
     * @type {Array}
     */
    const ret = [this];
    /**
     * Родительский объект
     *
     * @type {object}
     */
    let { parent = null } = this;
    while (parent) {
      ret?.unshift(parent);
      ({ parent = null } = parent);
    }
    return ret;
  },
  configurable,
};

/**
 * Объект, на котором определяется путь до объекта
 *
 * @type {string}
 */
const path = {
  /**
   * Геттер пути до объекта
   *
   * @returns {string} - Путь до объекта
   */
  get() {
    return this?.branch
      ?.map(
        ({ label = "", id = "" } = {}) =>
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
  const value = "no-cache";
  Object?.defineProperty(options?.headers, "cache-control", {
    value,
    enumerable,
  });
  return { options };
};

const id = {
  /**
   * Генератор id
   *
   * @returns {string} - Id
   */
  get value() {
    return crypto?.randomUUID();
  },
  type,
};

const resource = { id, ...Resource };

const page = { id, ...Page };

/**
 * Ф-ция проверки массивов ресурсов
 *
 * @param {Array} res - Проверяемый массив
 */
const resources = (res) => {
  res
    .slice()
    .reverse()
    .forEach((element = {}, i = 0, array = []) => {
      if (element?.constructor !== Object) res?.splice(array.length - 1 - i, 1);
      else {
        fixer(element, resource);
        if (!element?.url) res?.splice(array.length - 1 - i, 1);
      }
    });
  if (!res.length)
    res?.push(
      Object?.fromEntries(
        Object?.entries(resource)?.map(
          ([key = "", { value = null } = {}] = []) => [key, value],
        ),
      ),
    );
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
  fixer(data?.navbar, Navbar);
  fixer(data?.settings, Settings);
  resources(data?.css);
  resources(data?.js);
  ctx.data = data;
  return ctx;
};

const { data } = useFetch(
  () => (uri?.value == null ? null : `${uri?.value}/data.json`),
  { beforeFetch, afterFetch, refetch },
).json();

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
    fixer(value, page);
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

const tree = ref();

syncRef(data, tree);

/**
 * Функция для вызова рассчета массива страниц
 *
 * @returns {Array} - Страницы
 */
const get = () => getPages(tree?.value?.content);

const pages = computed(() =>
  get()?.map((value = {}) => {
    Object?.defineProperty(value, "pages", { get, configurable });
    return value;
  }),
);

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
  Object?.defineProperties(element, { index, prev, next });
  return element;
};

const js = computed(() => tree?.value?.js?.map(addProperties) ?? []);

const css = computed(() => tree?.value?.css?.map(addProperties) ?? []);

const navbar = computed(() => tree?.value?.navbar ?? {});

const content = computed(() => tree?.value?.content ?? []);

const settings = computed(() => tree?.value?.settings ?? {});

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
