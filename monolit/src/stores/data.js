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
 * @type {string}
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

/**
 * Модификатор для вотчера, указывает на проверку всех изменений в глубину
 *
 * @type {boolean}
 */
const deep = true;

/**
 * Приведение структуры объекта в соответствие с дефолтным
 *
 * @param {object} def - Эталонный объект
 * @param {object} obj - Объект
 * @returns {object} - Фиксированный объект
 */
const fix = (def = {}, obj = {}) => {
  Object.keys(obj).forEach((key) => {
    if (!Object.keys(def).includes(key)) Object.defineProperty(obj, key, {});
  });
  Object.entries(def).forEach(
    ([key = "", { type = "", value = null } = {}] = []) => {
      if (obj?.[key]?.constructor?.name !== type && obj?.[key] !== value)
        Object.defineProperty(obj, key, {
          value,
          writable,
          enumerable,
        });
    },
  );
  return obj;
};

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
 * @type {object}
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

/**
 * Объект, на котором определяется urn ресурса
 *
 * @type {object}
 */
const urn = {
  /**
   * Геттер urn ресурса
   *
   * @returns {string} - Urn ресурса
   */
  get() {
    return (
      (this?.loc && encodeURI(this?.loc?.replace(" ", "_") ?? "")) || this?.path
    );
  },
};

/**
 * Объект, на котором определяется название страницы
 *
 * @type {object}
 */
const name = {
  /**
   * Геттер названия страницы
   *
   * @returns {string} - Название страницы
   */
  get() {
    return this?.title ?? this?.label ?? "";
  },
};

/**
 * Объект, на котором определяется фавиконка страницы
 *
 * @type {object}
 */
const favicon = {
  /**
   * Геттер фавиконки страницы
   *
   * @returns {string} - Фавиконка страницы
   */
  get() {
    return this?.icon?.replace(/-./g, (x = []) => x?.[1]?.toUpperCase());
  },
};

/**
 * Тип для вычисляемого id
 *
 * @type {string}
 */
const type = "String";

/**
 * Объект, на котором определяется id
 *
 * @type {object}
 */
const id = {
  /**
   * Геттер id
   *
   * @returns {string} - Id
   */
  get value() {
    return crypto.randomUUID();
  },
  type,
};

/**
 * Шаблон ресурса для js & css
 *
 * @type {object}
 */
const resource = { id, ...Resource };

/**
 * Функция ремонта плоских массивов js & css
 *
 * @type {Function}
 * @param {Array} value - Исходный массив
 */
const fixPlain = (value = []) => {
  if (!value?.length) value?.push({});

  /**
   * Объект с массивом соседей
   *
   * @type {object}
   */
  const siblings = { value };

  value?.forEach((element) => {
    fix(resource, element);
    Object.defineProperties(element, { siblings, index, prev, next });
  });
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
 * Ф-ция удаления элементов js & css не являющихся объектами
 *
 * @param {Array} res - Проверяемый массив
 */
const clean = (res = []) => {
  res
    ?.slice()
    ?.reverse()
    ?.forEach((element = {}, i = 0, array = []) => {
      if (element?.constructor !== Object) res?.splice(array.length - 1 - i, 1);
    });
};

/**
 * Первый этап ремонта объекта данных
 *
 * @param {object} value - Объект данных
 * @returns {object} - Исправленный объект данных
 */
const fixData = (value = {}) => {
  fix(Data, value);
  fix(Navbar, value?.navbar);
  fix(Settings, value?.settings);
  clean(value?.css);
  clean(value?.js);
  return value;
};

/**
 * Колбек функция, запускаемая перед запросом "data.json"
 *
 * @type {Function}
 * @param {object} ctx - Контекстный объект
 * @param {object} ctx.options - Свойства запроса
 * @param {string} ctx.url - Урл
 * @param {Function} ctx.cancel - Ф-ция отмены запроса
 * @returns {object} - Трансформированный контекстный объект
 */
const beforeFetch = ({ url = "", options = {}, cancel = null } = {}) => {
  if (!url) cancel?.();

  /**
   * Уровень кеширования
   *
   * @type {string}
   */
  const value = "no-cache";

  Object.defineProperty(options?.headers ?? {}, "cache-control", {
    value,
    enumerable,
  });
  return { options };
};

/**
 * Колбек функция, запускаемая после запроса "data.json". В ней производится
 * первый этап ремонта данных
 *
 * @type {Function}
 * @param {object} ctx - Контекстный объект
 * @returns {object} - Трансформированный контекстный объект
 */
const afterFetch = (ctx) => {
  ctx.data = fixData(ctx?.data);
  return ctx;
};

/**
 * Данные, полученные из data.json
 *
 * @type {{
 *   data: {};
 * }}
 */
const { data } = useFetch(
  () => uri?.value?.constructor === String && `${uri?.value}/data.json`,
  {
    beforeFetch,
    afterFetch,
    refetch,
  },
).json();

/**
 * Рекурсивная функция преобразования древовидного объекта в массив страниц
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

const page = { id, ...Page };

/**
 * Рекурсивная функция ремонта страниц
 *
 * @type {Function}
 * @param {Array} pages - Элементы массива страниц
 * @param {object} parent - Родительский объект
 */
const fixDeep = (pages = [], parent = null) => {
  if (!pages?.length && !parent) pages?.push({});
  return pages?.forEach((value = {}) => {
    fix(page, value);
    Object.defineProperties(value, {
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
    fixDeep(value?.children, { value });
  });
};

/**
 * Главный реактивный объект данных
 *
 * @type {object}
 */
const $ = reactive(fixData());

/**
 * Функция для вызова рассчета массива страниц
 *
 * @returns {object[]} - Страницы
 */
const get = () => getPages($?.content);

/**
 * Рассчетный массив страниц
 *
 * @type {Array}
 */
const pages = computed(() =>
  get()?.map((value = {}) => {
    Object.defineProperty(value, "pages", { get });
    return value;
  }),
);

export default defineStore("data", () => ({ $, uri, pages }));

watch(data, (value = {}) => {
  Object.keys(value).forEach((key = "") => {
    $[key] = value?.[key];
  });
});
watch(() => $?.content, fixDeep, { deep });
watch(() => $?.css, fixPlain, { deep });
watch(() => $?.js, fixPlain, { deep });
