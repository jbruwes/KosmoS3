import { useFetch } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";

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

const deep = true;

/**
 * Приведение структуры объекта в соответствие с дефолтным
 *
 * @param {object} def - Эталонный объект
 * @param {object} obj - Объект
 * @returns {object} - Фиксированный объект
 */
const fixer = (def = {}, obj = {}) => {
  Object?.keys(obj)?.forEach((key) => {
    if (!Object?.keys(def)?.includes(key)) Object?.defineProperty(obj, key, {});
  });
  Object?.entries(def)?.forEach(
    ([key = "", { type = "", value = null } = {}] = []) => {
      if (obj?.[key]?.constructor?.name !== type && obj?.[key] !== value)
        Object?.defineProperty(obj, key, {
          value,
          writable,
          enumerable,
        });
    },
  );
  return obj;
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
    const ret = [];
    /**
     * Родительский объект
     *
     * @type {object}
     */
    let parent = this;
    do {
      ret?.unshift(parent);
      ({ parent = null } = parent);
    } while (parent);
    return ret;
  },
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
};

const urn = {
  /** @returns {string} - Путь до рекомендованный */
  get() {
    return (
      (this?.loc && encodeURI(this?.loc?.replace(" ", "_") ?? "")) || this?.path
    );
  },
};

const name = {
  /** @returns {string} - Вычисленное название страницы */
  get() {
    return this?.title ?? this?.label ?? "";
  },
};

const favicon = {
  /** @returns {string} - Вычисленное название иконки */
  get() {
    return this?.icon?.replace(/-./g, (x = []) => x?.[1]?.toUpperCase());
  },
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
const resources = (res = []) => {
  res
    .slice()
    .reverse()
    .forEach((element = {}, i = 0, array = []) => {
      if (element?.constructor !== Object) res?.splice(array.length - 1 - i, 1);
      else {
        fixer(resource, element);
        if (!element?.url) res?.splice(array.length - 1 - i, 1);
      }
    });
  if (!res.length) res?.push(fixer(resource));
};

/**
 * Исправление объекта данных
 *
 * @param {object} value - Объект данных
 * @returns {object} - Исправленный объект данных
 */
const fixData = (value = {}) => {
  fixer(Data, value);
  fixer(Navbar, value?.navbar);
  fixer(Settings, value?.settings);
  resources(value?.css);
  resources(value?.js);
  return value;
};

/**
 * Добавляем no-cache
 *
 * @type {Function}
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

/**
 * Преводим в массив
 *
 * @type {Function}
 * @param {object} ctx - Контекстный объект
 * @returns {object} - Трансформированный контекстный объект
 */
const afterFetch = (ctx) => {
  ctx.data = fixData(ctx?.data);
  return ctx;
};

const { data } = useFetch(
  () => uri?.value?.constructor === String && `${uri?.value}/data.json`,
  {
    beforeFetch,
    afterFetch,
    refetch,
  },
).json();

/**
 * Рекурсивная функция рассчета массива страниц
 *
 * @type {Function}
 * @param {Array} pages - Элементы массива страниц
 * @returns {Array} - Аддитивный массив страниц
 */
const getPages = (pages = []) =>
  pages?.reduce(
    (accumulator = [], value = {}) => [
      ...accumulator,
      ...getPages(value?.children),
    ],
    pages,
  );

/**
 * Рекурсивная функция коррекции страниц
 *
 * @type {Function}
 * @param {Array} pages - Элементы массива страниц
 * @param {object} parent - Родительский объект
 */
const fixContent = (pages = [], parent = {}) =>
  pages?.forEach((value = {}) => {
    fixer(page, value);
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
    fixContent(value?.children, { value });
  });

const $ = reactive(fixData());

/**
 * Функция для вызова рассчета массива страниц
 *
 * @returns {Array} - Страницы
 */
const get = () => getPages($?.content);

const pages = computed(() =>
  get()?.map((value = {}) => {
    Object?.defineProperty(value, "pages", { get });
    return value;
  }),
);

/**
 * @type {Function}
 * @param {Array} value - Исходный массив
 */
const addProperties = (value = []) => {
  value?.forEach((element) => {
    Object?.defineProperty(element, "siblings", { value });
    Object?.defineProperties(element, { index, prev, next });
  });
};

watch(data, (value) => {
  Object.keys(value).forEach((key = "") => {
    $[key] = value?.[key];
  });
});

watch(() => $?.content, fixContent, { deep });
watch(() => $?.css, addProperties, { deep });
watch(() => $?.js, addProperties, { deep });

export default defineStore("data", () => ({ $, uri, pages }));
