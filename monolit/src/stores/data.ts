import {
  AfterFetchContext,
  BeforeFetchContext,
  Fn,
  useFetch,
} from "@vueuse/core";
import Ajv from "ajv";
import dynamicDefaults, {
  DynamicDefaultFunc,
} from "ajv-keywords/dist/definitions/dynamicDefaults";
import { FromSchema } from "json-schema-to-ts";
import { defineStore } from "pinia";
import { computed, ComputedRef, reactive, Ref, ref, watch } from "vue";

import Data, { plainData } from "~/src/schemas/data";
import Navbar from "~/src/schemas/navbar";
import Page, { plainPage } from "~/src/schemas/page";
import Resource from "~/src/schemas/resource";
import Settings from "~/src/schemas/settings";

/**
 * @type {TPage}
 * @property {string | undefined} id - Идентификатор страницы, значения по
 *   умолчанию вычисляются динамически
 * @property {string | null} [changefreq=null] - Вероятная частота изменения
 *   этой страницы. Это значение предоставляет общую информацию для поисковых
 *   систем и может не соответствовать точно частоте сканирования этой страницы.
 *   Допустимые значения: always, hourly, daily, weekly, monthly, yearly, never.
 *   Default is `null`
 * @property {string | null} [description=null] - Предназначен для
 *   предоставления поисковым системам краткого описания содержимого страницы
 *   для индексации и вывода сопроводительной информации в выдаче результатов
 *   поиска. Когда-то информация из этого тега обязательно отображалась в
 *   поисковой выдаче и имела особый вес при индексации, однако, в связи со
 *   злоупотреблениями, различные поисковые системы используют разные алгоритмы
 *   для оценки релевантности указанного в теге описания и содержимого страницы,
 *   на основании чего могут игнорировать содержимое тега. Default is `null`
 * @property {string | null} [icon=null] - Название иконки сайта из набора
 *   иконок mdi. Default is `null`
 * @property {string | null} [image=null] - Содержит url картинки, используемой
 *   поисковиками в выдаче. Default is `null`
 * @property {string[]} [keywords=[]] -Используется для предоставления данных
 *   поисковикам для повышения значимости некоторых слов при поиске, а также для
 *   навигации внутри сайта по хештегам. Default is `[]`
 * @property {string | null} [label=null] - Краткое название страницы,
 *   используется в пути доступа. Default is `null`
 * @property {string | null} [lastmod=null] - Дата последнего изменения файла.
 *   Эта дата должна быть в формате W3C Datetime. Default is `null`
 * @property {string | null} [loc=null] - URL-адрес страницы. Этот URL-адрес
 *   должен начинаться с префикса (например, HTTP) и заканчиваться косой чертой,
 *   если Ваш веб-сервер требует этого. Длина этого значения не должна превышать
 *   2048 символов. Default is `null`
 * @property {number | null} [priority=null] - Приоритетность URL относительно
 *   других URL на Вашем сайте. Допустимый диапазон значений — от 0,0 до 1,0.
 *   Это значение не влияет на процедуру сравнения Ваших страниц со страницами
 *   на других сайтах — оно только позволяет указать поисковым системам, какие
 *   страницы, по Вашему мнению, более важны для сканеров. Default is `null`
 * @property {string} [template=""] - Шаблон страницы в формате vue. Default is
 *   `""`
 * @property {string} [script=""] - Скрипты страницы. Default is `""`
 * @property {string} [style=""] - Стили страницы. Default is `""`
 * @property {string | null} [theme=null] - Тема daisyui, @see
 *   {@link https://daisyui.com/docs/themes/} см. документацию. Default is
 *   `null`
 * @property {string | null} [title=null] - Полный заголовок страницы. Default
 *   is `null`
 * @property {boolean} [visible=true] - Флаг видимости страницы на сайте. Не
 *   скрывает страницу от поисковиков. Default is `true`
 * @property {string | null} [type=null] - Тип объекта, например, video.movie
 *   (фильм), @see {@link https://ogp.me/#types} см. документацию. Если у вас
 *   несколько объектов на странице, выберите один из них (главный). В
 *   зависимости от типа можно указать дополнительные свойства. Default is
 *   `null`
 * @property {string | null} [alt=null] - Описание картинки для страницы.
 *   Default is `null`
 * @property {string | null} [full=true] - Признак, что страница должна быть
 *   минимум по высоте окна браузера. Default is `true`
 * @property {boolean} [setup=true] - Добавление атрибута setup в таг script.
 *   Default is `true`
 * @property {boolean} [scoped=true] - Добавление атрибута scoped в таг style.
 *   Default is `true`
 * @property {TPage[]} children - Дочерние страницы
 * @property {TPage | null} parent - Родительская страница
 * @property {TPage[]} siblings - Массив одноуровневых страниц
 * @property {TPage[]} branch - Массив объектов, определяющий путь до страницы,
 *   проще говоря, ветка в дереве
 * @property {string} path - Путь до страницы для использования в поисковой
 *   строке браузера
 * @property {number} index - Порядковый номер страницы в массиве одноуровневых
 *   страниц
 * @property {TPage | null} prev - Предыдущая страница в массиве одноуровневых
 *   страниц
 * @property {TPage | null} next - Последующая страниа в массиве одноуровневых
 *   станиц
 * @property {string | null} name - Вычисленное имя страницы, предпочтительно
 *   полное
 * @property {string} urn
 * @property {astring | nullny} favicon
 * @property {boolean} edit
 * @property {TPage[]} pages
 */
type TPage = FromSchema<typeof plainPage> & {
  children: TPage[];
  parent: TPage | null;
  siblings: TPage[];
  branch: TPage[];
  path: string;
  index: number;
  prev: TPage | null;
  next: TPage | null;
  name: string | null;
  urn: string;
  favicon: string | null;
  edit?: boolean;
  pages: TPage[];
};

type TResource = FromSchema<typeof Resource>;

type TData = FromSchema<
  typeof plainData,
  { references: [typeof Settings, typeof Resource, typeof Navbar] }
> & { content: TPage[] | null };

/**
 * RandomUUID
 *
 * @returns {DynamicDefaultFunc} Ф-ция динамического рассчета uuid при валидации
 */
dynamicDefaults.DEFAULTS.uuid = (): DynamicDefaultFunc => (): any =>
  crypto.randomUUID();

const content = null;
const settings = null;
const style = null;
const script = null;
const css = null;
const js = null;
const navbar = null;

/**
 * Главный реактивный объект данных
 *
 * @type {TData}
 */
const $: TData = reactive({
  content,
  settings,
  style,
  script,
  css,
  js,
  navbar,
});

/**
 * Путь, по которому происходит загрузка data.json
 *
 * @type {Ref<string | null>}
 */
const uri: Ref<string | null> = ref(null);

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

const schemas = [Resource, Page, Settings, Navbar, Data];

const useDefaults: boolean = true;
const coerceTypes: boolean = true;
const removeAdditional: boolean = true;
const esm: boolean = true;
const code: object = { esm };
const keywords = [dynamicDefaults()];

const ajv: Ajv = new Ajv({
  useDefaults,
  coerceTypes,
  removeAdditional,
  schemas,
  code,
  keywords,
});

const validate = ajv.getSchema("urn:jsonschema:data");

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
  if (!validate?.(ctx.data)) ctx.data = null;
  return ctx;
};

/**
 * Данные, полученные из data.json
 *
 * @type {{ data: Ref<any> }}
 */
const { data }: { data: Ref<any> } = useFetch(
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
 * @param {TPage[]} pages - Элементы массива страниц
 * @returns {TPage[]} - Аддитивный массив страниц
 */
const getPages: Function = (pages: TPage[]): TPage[] =>
  pages.flatMap((element) => [element, ...getPages(element.children ?? [])]);

/**
 * Функция для вызова рассчета массива страниц
 *
 * @type {() => any}
 * @returns {TPage[]} - Страницы
 */
const get: () => any = (): TPage[] => getPages($.content ?? []);

/**
 * Рассчетный массив страниц
 *
 * @type {ComputedRef<TPage[]>}
 */
const pages: ComputedRef<TPage[]> = computed(() =>
  get().map((value = {}) => {
    Object.defineProperty(value, "pages", { get });
    return value;
  }),
);

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
    return (<TPage>this).siblings.findIndex(
      ({ id }) => (<TPage>this).id === id,
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
   * @returns {TPage | null} - Предыдущий объект
   */
  get(): TPage | null {
    return (<TPage>this).siblings[(<TPage>this).index - 1] ?? null;
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
   * @returns {TPage | null} - Следующий объект
   */
  get(): TPage | null {
    return (<TPage>this).siblings[(<TPage>this).index + 1] ?? null;
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
   * @returns {TPage[]} - Ветвь объектов
   */
  get(): TPage[] {
    /**
     * Результирующий массив для записи ветви
     *
     * @type {TPage[]}
     */
    const ret: TPage[] = [];
    /**
     * Родительский объект
     *
     * @type {TPage | null}
     */
    let parent: TPage | null = <TPage>this;
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
    return (<TPage>this).branch
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
      ((<TPage>this).loc &&
        encodeURI((<TPage>this).loc?.replace(" ", "_") ?? "")) ||
      (<TPage>this).path
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
    return (<TPage>this).title ?? (<TPage>this).label ?? null;
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
      (<TPage>this).icon?.replace(/-./g, (x) => x[1].toUpperCase()) ?? null
    );
  },
};

/**
 * Функция ремонта плоских массивов js & css
 *
 * @type {Function}
 * @param {{ value: TResource[] }} siblings - Исходный массив
 */
const fixPlain: Function = (siblings: { value: TResource[] }) => {
  siblings.value.forEach((element) => {
    Object.defineProperties(element, { siblings, index, prev, next });
  });
};

/**
 * Рекурсивная функция ремонта страниц
 *
 * @type {Function}
 * @param {{ value: TPage[] }} siblings - Элементы массива страниц
 * @param {{ value: TPage }} parent - Элементы массива страниц
 */
const fixDeep: Function = (
  siblings: { value: TPage[] },
  parent: { value: TPage | null } = { value: null },
) => {
  siblings.value.forEach((value) => {
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
    fixDeep({ value: value.children ?? [] }, { value });
  });
};

export default defineStore("data", () => ({ $, uri, pages }));

watch(data, (value) => {
  Object.keys(value).forEach((key) => {
    $[key as keyof TData] = value[key];
  });
});
watch($, (value) => {
  validate?.(value);
});
watch(
  () => $?.content,
  (value) => {
    fixDeep({ value });
  },
  { deep },
);
watch(
  () => $?.css,
  (value) => {
    fixPlain({ value });
  },
  { deep },
);
watch(
  () => $?.js,
  (value) => {
    fixPlain({ value });
  },
  { deep },
);
