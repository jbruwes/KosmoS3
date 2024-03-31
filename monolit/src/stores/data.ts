import {
  AfterFetchContext,
  BeforeFetchContext,
  Fn,
  useFetch,
} from "@vueuse/core";
import { defineStore } from "pinia";
import {
  computed,
  ComputedRef,
  reactive,
  Ref,
  ref,
  watch,
  WatchCallback,
} from "vue";

import Data from "~/src/assets/data.json";
import Navbar from "~/src/assets/navbar.json";
import Page from "~/src/assets/page.json";
import Resource from "~/src/assets/resource.json";
import Settings from "~/src/assets/settings.json";

// /**
//  * @typedef {object} IMap
//  * @property {string | undefined} [key: string]
//  */
interface IMap {
  [key: string]: string | undefined;
}

// /**
//  * @typedef {object} IDefine
//  * @property {string} type
//  * @property {boolean | string | number | object | null} value
//  */
interface IDefine {
  type: string;
  value: boolean | string | number | object | null;
}

// /**
//  * @typedef {object} INavbar
//  * @property {string | null} theme
//  * @property {string[]} classes
//  * @property {string[]} scrollClasses
//  * @property {string} template
//  * @property {string} script
//  * @property {string} style
//  * @property {boolean} setup
//  * @property {boolean} scoped
//  */
interface INavbar {
  theme: string | null;
  classes: string[];
  scrollClasses: string[];
  template: string;
  script: string;
  style: string;
  setup: boolean;
  scoped: boolean;
}

// /**
//  * @typedef {object} IPageEnumerable
//  * @property {string} id
//  * @property {string | null} changefreq
//  * @property {IPage[]} children
//  * @property {string | null} description
//  * @property {string | null} icon
//  * @property {string | null} image
//  * @property {string[]} keywords
//  * @property {string | null} label
//  * @property {string | null} lastmod
//  * @property {string | null} loc
//  * @property {number | null} priority
//  * @property {string} template
//  * @property {string} script
//  * @property {string} style
//  * @property {string | null} theme
//  * @property {string | null} title
//  * @property {boolean} visible
//  * @property {string | null} type
//  * @property {string | null} alt
//  * @property {boolean} full
//  * @property {boolean} setup
//  * @property {boolean} scoped
//  */
interface IPageEnumerable {
  id: string;
  changefreq: string | null;
  children: IPage[];
  description: string | null;
  icon: string | null;
  image: string | null;
  keywords: string[];
  label: string | null;
  lastmod: string | null;
  loc: string | null;
  priority: number | null;
  template: string;
  script: string;
  style: string;
  theme: string | null;
  title: string | null;
  visible: boolean;
  type: string | null;
  alt: string | null;
  full: boolean;
  setup: boolean;
  scoped: boolean;
}

// /**
//  * @typedef {object} IPageEnumerable
//  * @property {IDefine} id
//  * @property {IDefine} changefreq
//  * @property {IDefine} children
//  * @property {IDefine} description
//  * @property {IDefine} icon
//  * @property {IDefine} image
//  * @property {IDefine} keywords
//  * @property {IDefine} label
//  * @property {IDefine} lastmod
//  * @property {IDefine} loc
//  * @property {IDefine} priority
//  * @property {IDefine} template
//  * @property {IDefine} script
//  * @property {IDefine} style
//  * @property {IDefine} theme
//  * @property {IDefine} title
//  * @property {IDefine} visible
//  * @property {IDefine} type
//  * @property {IDefine} alt
//  * @property {IDefine} full
//  * @property {IDefine} setup
//  * @property {IDefine} scoped
//  */
type TPageEnumerable = Record<keyof IPageEnumerable, IDefine>;

// /**
//  * @typedef {object} IPage
//  * @property {string} id
//  * @property {string | null} changefreq
//  * @property {IPage[]} children
//  * @property {string | null} description
//  * @property {string | null} icon
//  * @property {string | null} image
//  * @property {string[]} keywords
//  * @property {string | null} label
//  * @property {string | null} lastmod
//  * @property {string | null} loc
//  * @property {number | null} priority
//  * @property {string} template
//  * @property {string} script
//  * @property {string} style
//  * @property {string | null} theme
//  * @property {string | null} title
//  * @property {boolean} visible
//  * @property {string | null} type
//  * @property {string | null} alt
//  * @property {boolean} full
//  * @property {boolean} setup
//  * @property {boolean} scoped
//  * @property {IPage | null} parent
//  * @property {IPage[]} siblings
//  * @property {IPage[]} branch
//  * @property {string} path
//  * @property {number} index
//  * @property {IPage | null} prev
//  * @property {IPage | null} next
//  * @property {string | null} name
//  * @property {string} urn
//  * @property {string | null} favicon
//  * @property {boolean} [edit]
//  */
export interface IPage extends IPageEnumerable {
  parent: IPage | null;
  siblings: IPage[];
  branch: IPage[];
  path: string;
  index: number;
  prev: IPage | null;
  next: IPage | null;
  name: string | null;
  urn: string;
  favicon: string | null;
  edit?: boolean;
}

// /**
//  * @typedef {object} ISettings
//  * @property {string | null} yandex
//  * @property {string | null} metrika
//  * @property {string | null} google
//  * @property {string | null} analytics
//  * @property {boolean} landing
//  */
interface ISettings {
  yandex: string | null;
  metrika: string | null;
  google: string | null;
  analytics: string | null;
  landing: boolean;
}

// /**
//  * @typedef {object} IResource
//  * @property {string} id
//  * @property {string} url
//  * @property {boolean} visible
//  */
interface IResource {
  id: string;
  url: string;
  visible: boolean;
}

// /**
//  * @typedef {object} TResource
//  * @property {IDefine} id
//  * @property {IDefine} url
//  * @property {IDefine} visible
//  */
type TResource = Record<keyof IResource, IDefine>;

// /**
//  * @typedef {object} IData
//  * @property {INavbar} navbar
//  * @property {IPage[]} content
//  * @property {ISettings} settings
//  * @property {string} style
//  * @property {string} script
//  * @property {IResource[]} css
//  * @property {IResource[]} js
//  */
interface IData {
  navbar: INavbar;
  content: IPage[];
  settings: ISettings;
  style: string;
  script: string;
  css: IResource[];
  js: IResource[];
}

/**
 * Путь, по которому происходит загрузка data.json
 *
 * @type {Ref<string | null>}
 */
const uri: Ref<string | null> = ref(null);

/**
 * Равен true только в том случае, если значение, ассоциированное со свойством,
 * может быть изменено с помощью оператора присваивания.
 *
 * @constant
 * @default
 * @type {boolean}
 */

const writable: boolean = true;

/**
 * Равен true только в том случае, если это свойство можно увидеть через
 * перечисление свойств содержащего его объекта.
 *
 * @constant
 * @default
 * @type {boolean}
 */
const enumerable: boolean = true;

/**
 * Refetching on URL change. Using a ref for the url parameter will allow the
 * useFetch function to automatically trigger another request when the url is
 * changed.
 *
 * @constant
 * @default
 * @type {boolean}
 */
const refetch: boolean = true;

/**
 * Модификатор для вотчера, указывает на проверку всех изменений в глубину
 *
 * @constant
 * @default
 * @type {boolean}
 */
const deep: boolean = true;

/**
 * Приведение структуры объекта в соответствие с дефолтным
 *
 * @type {Function}
 * @param {IDefine} def - Эталонный объект
 * @param {IMap} obj - Объект
 * @returns {{}} - Фиксированный объект
 */
const fix: Function = (def: IDefine, obj: IMap): {} => {
  Object.keys(obj).forEach((key) => {
    if (!Object.keys(def).includes(key)) Object.defineProperty(obj, key, {});
  });
  Object.entries(def).forEach(([key, { type, value }]) => {
    if (obj[key]?.constructor?.name !== type && obj[key] !== value)
      Object.defineProperty(obj, key, {
        value,
        writable,
        enumerable,
      });
  });
  return obj;
};

/**
 * Объект, на котором определяется свойство позиции в соседних объектах
 *
 * @type {PropertyDescriptor}
 */
const index: PropertyDescriptor = {
  /**
   * Геттер позиции в соседних объектах
   *
   * @returns {number} - Позиция в соседних объектах
   */
  get(): number {
    return (<IPage>this).siblings.findIndex(
      ({ id }) => (<IPage>this).id === id,
    );
  },
};

/**
 * Объект, на котором определяется свойство предыдущего объекта
 *
 * @type {PropertyDescriptor}
 */
const prev: PropertyDescriptor = {
  /**
   * Геттер предыдущего объекта
   *
   * @returns {IPage | null} - Предыдущий объект
   */
  get(): IPage | null {
    return (<IPage>this).siblings[(<IPage>this).index - 1] ?? null;
  },
};

/**
 * Объект, на котором определяется свойство следующего объекта
 *
 * @type {PropertyDescriptor}
 */
const next: PropertyDescriptor = {
  /**
   * Геттер следующего объекта
   *
   * @returns {IPage | null} - Следующий объект
   */
  get(): IPage | null {
    return (<IPage>this).siblings[(<IPage>this).index + 1] ?? null;
  },
};

/**
 * Объект, на котором определяется свойство ветви объектов
 *
 * @type {PropertyDescriptor}
 */
const branch: PropertyDescriptor = {
  /**
   * Геттер ветви объектов
   *
   * @returns {IPage[]} - Ветвь объектов
   */
  get(): IPage[] {
    /**
     * Результирующий массив для записи ветви
     *
     * @type {IPage[]}
     */
    const ret: IPage[] = [];
    /**
     * Родительский объект
     *
     * @type {IPage | null}
     */
    let parent: IPage | null = <IPage>this;
    do {
      ret.unshift(parent);
      ({ parent = null } = parent);
    } while (parent);
    return ret;
  },
};

/**
 * Объект, на котором определяется путь до объекта
 *
 * @type {PropertyDescriptor}
 */
const path: PropertyDescriptor = {
  /**
   * Геттер пути до объекта
   *
   * @returns {string | null} - Путь до объекта
   */
  get(): string | null {
    return (<IPage>this).branch
      .map(
        ({ label, id }) =>
          encodeURIComponent(label?.replace(" ", "_") ?? "") || id,
      )
      .slice(1)
      .join("/");
  },
};

/**
 * Объект, на котором определяется urn ресурса
 *
 * @type {PropertyDescriptor}
 */
const urn: PropertyDescriptor = {
  /**
   * Геттер urn ресурса
   *
   * @returns {string} - Urn ресурса
   */
  get(): string {
    return (
      ((<IPage>this).loc &&
        encodeURI((<IPage>this).loc?.replace(" ", "_") ?? "")) ||
      (<IPage>this).path
    );
  },
};

/**
 * Объект, на котором определяется название страницы
 *
 * @type {PropertyDescriptor}
 */
const name: PropertyDescriptor = {
  /**
   * Геттер названия страницы
   *
   * @returns {string | null} - Название страницы
   */
  get(): string | null {
    return (<IPage>this).title ?? (<IPage>this).label ?? null;
  },
};

/**
 * Объект, на котором определяется фавиконка страницы
 *
 * @type {PropertyDescriptor}
 */
const favicon: PropertyDescriptor = {
  /**
   * Геттер фавиконки страницы
   *
   * @returns {string | null} - Фавиконка страницы
   */
  get(): string | null {
    return (
      (<IPage>this).icon?.replace(/-./g, (x) => x[1].toUpperCase()) ?? null
    );
  },
};

/**
 * Тип для вычисляемого id
 *
 * @constant
 * @default
 * @type {string}
 */
const type: string = "String";

/**
 * Объект, на котором определяется id
 *
 * @type {IDefine}
 */
const id: IDefine = {
  /**
   * Геттер id
   *
   * @returns {string} - Id
   */
  get value(): string {
    return crypto.randomUUID();
  },

  type,
};

/**
 * Прототип ресурса для js & css
 *
 * @type {TResource}
 */
const resource: TResource = {
  id,
  ...Resource,
};

/**
 * Функция ремонта плоских массивов js & css
 *
 * @type {WatchCallback}
 * @param {IResource[]} value - Исходный массив
 */
const fixPlain: WatchCallback = (value: IResource[]) => {
  if (!value.length) value.push(fix(resource, {}));

  /**
   * Объект с массивом соседей
   *
   * @type {PropertyDescriptor}
   */
  const siblings: PropertyDescriptor = { value };

  value.forEach((element) => {
    fix(resource, element);
    Object.defineProperties(element, { siblings, index, prev, next });
  });
};

/**
 * Объект, на котором определяется свойство массива соседних объектов
 *
 * @type {PropertyDescriptor}
 */
const siblings: PropertyDescriptor = {
  /**
   * Геттер массива соседних объектов
   *
   * @returns {IPage[]} - Массив соседних объектов
   */
  get(): IPage[] {
    return (<IPage>this).parent?.children ?? [<IPage>this];
  },
};

/**
 * Ф-ция удаления элементов js & css не являющихся объектами
 *
 * @type {Function}
 * @param {IResource[]} res - Проверяемый массив
 */
const clean: Function = (res: IResource[]) => {
  res
    .slice()
    .reverse()
    .forEach((element, i, array) => {
      if (element.constructor !== Object) res.splice(array.length - 1 - i, 1);
    });
};

/**
 * Первый этап ремонта объекта данных
 *
 * @type {Function}
 * @param {IData} [value] - Объект данных
 * @returns {IData} - Исправленный объект данных
 */
const fixData: Function = (value: IData) => {
  fix(Navbar, value.navbar);
  fix(Settings, value.settings);
  clean(value.css);
  clean(value.js);
  return value;
};

/**
 * Колбек функция, запускаемая перед запросом "data.json"
 *
 * @type {(ctx: BeforeFetchContext) => Partial<BeforeFetchContext>}
 * @param {BeforeFetchContext} ctx - Контекстный объект
 * @param {RequestInit} ctx.options - Свойства запроса
 * @param {string} ctx.url - Урл
 * @param {Fn} ctx.cancel - Ф-ция отмены запроса
 * @returns {Partial<BeforeFetchContext>} - Трансформированный контекстный
 *   объект
 */
const beforeFetch: (ctx: BeforeFetchContext) => Partial<BeforeFetchContext> = ({
  url,
  options,
  cancel,
}: BeforeFetchContext): Partial<BeforeFetchContext> => {
  if (!url) cancel();

  /**
   * Уровень кеширования
   *
   * @type {string}
   */
  const value: string = "no-cache";

  Object.defineProperty(options.headers, "cache-control", {
    value,
    enumerable,
  });
  return { options };
};

/**
 * Колбек функция, запускаемая после запроса "data.json". В ней производится
 * первый этап ремонта данных
 *
 * @type {(ctx: AfterFetchContext) => Partial<AfterFetchContext>}
 * @param {AfterFetchContext} ctx - Контекстный объект
 * @returns {object} - Трансформированный контекстный объект
 */
const afterFetch: (ctx: AfterFetchContext) => Partial<AfterFetchContext> = (
  ctx: AfterFetchContext,
): Partial<AfterFetchContext> => {
  ctx.data = fixData(fix(Data, ctx.data));
  return ctx;
};

/**
 * Данные, полученные из data.json
 *
 * @type {{ data: Ref }}
 */
const { data }: { data: Ref } = useFetch(
  () => (uri.value?.constructor === String ? `${uri.value}/data.json` : ""),
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
 * @param {IPage[]} pages - Элементы массива страниц
 * @returns {IPage[]} - Аддитивный массив страниц
 */
const getPages: Function = (pages: IPage[]): IPage[] =>
  pages.reduce(
    (accumulator, value) => [...accumulator, ...getPages(value.children)],
    pages,
  );

/**
 * Прототип страницы
 *
 * @type {TPageEnumerable}
 */
const page: TPageEnumerable = { id, ...Page };

/**
 * Рекурсивная функция ремонта страниц
 *
 * @type {Function}
 * @param {IPage[]} pages - Элементы массива страниц
 * @param {{ value: IPage | null }} [parent] - Родительский объект
 */
const fixDeep: Function = (
  pages: IPage[],
  parent: { value: IPage | null } = { value: null },
) => {
  if (!pages?.length && !parent.value) pages.push(fix(page, {}));
  return pages.forEach((value) => {
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
    fixDeep(value.children, { value });
  });
};

/**
 * Главный реактивный объект данных
 *
 * @type {IData}
 */
const $: IData = reactive(fixData(fix(Data, {})));

/**
 * Функция для вызова рассчета массива страниц
 *
 * @type {() => any}
 * @returns {IPage[]} - Страницы
 */
const get: () => any = (): IPage[] => getPages($.content);

/**
 * Рассчетный массив страниц
 *
 * @type {ComputedRef<IPage[]>}
 */
const pages: ComputedRef<IPage[]> = computed(() =>
  get().map((value = {}) => {
    Object.defineProperty(value, "pages", { get });
    return value;
  }),
);

export default defineStore("data", () => ({ $, uri, pages }));

watch(data, (value) => {
  Object.keys(value).forEach((key) => {
    $[key as keyof IData] = value[key];
  });
});
watch(
  () => $?.content,
  (value) => {
    fixDeep(value);
  },
  { deep },
);
watch(() => $?.css, fixPlain, { deep });
watch(() => $?.js, fixPlain, { deep });
