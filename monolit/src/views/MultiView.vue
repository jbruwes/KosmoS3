<template lang="pug">
.flex.snap-start(
  v-for="the in cmpSiblingsFilter",
  :id="the?.id",
  :key="the?.id",
  ref="refElements",
  v-intersection-observer="[fncIntersectionObserver,{root,rootMargin,threshold}]",
  :class="{ 'min-h-full': the?.full }"
)
  .prose.w-full.max-w-none.flex-auto.text-sm(
    v-cloak,
    class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    :data-theme="the?.theme",
    :role="the?.id === cmpThe?.id ? 'main' : null"
  )
    component(
      :is="cmpTemplates?.[the?.id]",
      :the="the",
      @vue:mounted="cmpResolve?.[the?.id]"
    )
</template>
<script setup>
import { vIntersectionObserver } from "@vueuse/components";
import {
  get,
  unrefElement,
  useArrayFilter,
  useArrayFind,
  useArrayFindIndex,
  useArrayMap,
  useParentElement,
} from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

import selectors from "@/assets/glightbox.json";
/**
 * Хранилище приложения монолит
 *
 * @typedef {object} strApp
 * @property {Function} fncTemplate - Функция, возвращающая Promise на
 *   сконструированный шаблон
 */
import app from "@/stores/app";
/**
 * Хранилище данных приложения монолит
 *
 * @typedef {object} strData
 * @property {computed} pages - Общий массив всех объектов страниц сайта
 */
import data from "@/stores/data";

/** @type {strApp} */
const strApp = app();

/** @type {strApp} */
const { fncTemplate } = strApp;

/** @type {strData} */
const strData = data();

/** @type {strData} */
const { pages } = storeToRefs(strData);

/**
 * Текущий роут сайта
 *
 * @type {route}
 */
const route = useRoute();

/**
 * Роутер сайта
 *
 * @type {router}
 */
const router = useRouter();

/**
 * Функция проверки совпадения Id объекта страницы с названием роута
 *
 * @type {Function}
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @returns {boolean} Признак совпадения с названием текущего роута
 */
const fncCurrentIndex = ({ id = crypto.randomUUID() } = {}) =>
  id === route?.name;

/**
 * Порядковый номер выбранной страницы в общем массиве всех объектов страниц
 * сайта
 *
 * @type {computed}
 * @see {@link fncCurrentIndex} См. поисковую функцию
 */
const cmpCurrentIndex = useArrayFindIndex(pages, fncCurrentIndex);

/**
 * Функция вычисления переадрессации корневого объекта страницы на первый
 * доступный объект страницы
 *
 * @type {Function}
 * @returns {object} Объект страницы
 */
const fncThe = () =>
  get(cmpCurrentIndex)
    ? get(pages, get(cmpCurrentIndex))
    : get(pages, 0)?.children?.[0];

/**
 * Вычисление переадресации корневого объекта страницы на первый доступный
 * объект страницы
 *
 * @type {computed}
 * @see {@link fncThe} См. функцию вычисления переадресации
 */
const cmpThe = computed(fncThe);

/**
 * Функция вычисления массива объектов страниц с одинаковым предком
 *
 * @type {Function}
 * @returns {Array} Массив объектов страниц с одинаковым предком
 */
const fncSiblings = () => get(cmpThe, "siblings");

/**
 * Вычисление массива объектов страниц с одинаковым предком
 *
 * @type {computed}
 * @see {@link fncSiblings} см. ф-цию получения массива, просто геттер утрачивает реактивность
 */
const cmpSiblings = computed(fncSiblings);

/**
 * Функция фильтрации станиц по признаку видимости
 *
 * @type {Function}
 * @param {object} page - Объект страницы
 * @param {boolean} page.visible - Флаг видимости
 * @returns {boolean} Флаг видимости
 */
const fncSiblingsFilter = ({ visible = true } = {}) => visible;

/**
 * Вычисление массива видимых объектов страниц с одинаковым предком
 *
 * @type {computed}
 * @see {@link fncSiblingsFilter} см. ф-цию фильтрации
 */
const cmpSiblingsFilter = useArrayFilter(cmpSiblings, fncSiblingsFilter);

/**
 * Функция вычисления элемента с промисом и ресолверами
 *
 * @type {Function}
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @returns {{
 *   id: string;
 *   promise: Promise;
 *   resolve: Function;
 *   reject: Function;
 * }}
 *   Идентифицированный элемент массива с промисом и ресолверами
 */
const fncMountedPromisesWithResolvers = ({
  id = crypto.randomUUID(),
} = {}) => ({
  id,
  ...Promise.withResolvers(),
});

/**
 * Вычисление массива промисов с ресолверами
 *
 * @returns {Array} Массив промисов с ресолверами
 * @see {@link fncMountedPromisesWithResolvers} см. ф-цию вычисления
 */
const cmpMountedPromisesWithResolvers = useArrayMap(
  cmpSiblingsFilter,
  fncMountedPromisesWithResolvers,
);

/**
 * Функция вычисления промиса
 *
 * @type {Function}
 * @param {Array} entry - Идентифицированный элемент массива промисов с
 * @param {Promise} entry.promise - Промис
 * @returns {Promise} - Промис
 */
const fncMountedPromises = ({ promise = null } = {}) => promise;

/**
 * Вычисление плоского массива промисов
 *
 * @see {@link fncMountedPromises} См. ф-цию вычисления
 */
const cmpMountedPromises = useArrayMap(
  cmpMountedPromisesWithResolvers,
  fncMountedPromises,
);

/**
 * Функция вычисления идентифицированного массива ресолверов
 *
 * @type {Function}
 * @param {object} entry - Идентифицированный объеккт промиса с ресолверами
 * @param {string} entry.id - Id
 * @param {Function} entry.resolve - Ресолвер
 * @returns {[string, Function]} - Массив ресолвера с идентификацией
 */
const fncMountedResolvers = ({
  id = crypto.randomUUID(),
  resolve = null,
} = {}) => [id, resolve];

/**
 * Вычисление идентифицированного массива ресолверов
 *
 * @type {computed}
 * @see {@link fncMountedResolvers} - см. ф-цию вычисления
 */
const cmpMountedResolvers = useArrayMap(
  cmpMountedPromisesWithResolvers,
  fncMountedResolvers,
);

/**
 * Функция вычисления идентифицированного объекта промисов
 *
 * @type {Function}
 * @returns {object} Идентифицированный объекта промисов
 */
const fncResolve = () => Object.fromEntries(get(cmpMountedResolvers));

/**
 * Вычисление идентифицированного объекта промисов
 *
 * @type {computed}
 * @see {@link fncResolve} см. ф-цию вычисления
 */
const cmpResolve = computed(fncResolve);

/**
 * Функция вычисления элементов массива с готовыми шаблонами
 *
 * @type {Function}
 * @param {object} the - Объект страницы
 * @returns {[string, object]} Массив из id и готового шаблона
 */
const fncTemplateEntries = (the = {}) => [the?.id, fncTemplate(the)];

/**
 * Вычисление массива загруженных шаблонов
 *
 * @type {computed}
 * @see {@link fncTemplateEntries} см. функцию вычисления
 */
const cmpTemplateEntries = useArrayMap(cmpSiblingsFilter, fncTemplateEntries);

/**
 * Функция вычисления преобразования массива загруженных шаблонов в объект
 *
 * @type {Function}
 * @returns {object} Объект с загруженных шаблонов
 */
const fncTemplates = () => Object.fromEntries(get(cmpTemplateEntries));

/**
 * Вычисление объекта загруженных шаблонов
 *
 * @type {computed}
 * @see {@link fncTemplates} см. функцию вычисления
 */
const cmpTemplates = computed(fncTemplates);

/**
 * Сдвиг области видимости
 *
 * @type {string}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin} см. документацию
 */
const rootMargin = "-1% 0px -99%";

/**
 * Процент площади объекта, который должен попасть в область видимости
 *
 * @type {number}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds} см. документацию
 */
const threshold = 0;

/**
 * Родительский элемент представления
 *
 * @type {ref}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root} см. документацию
 */
const root = useParentElement();

/**
 * Флаг постановки проверки пересечения страницы с облатью видимости на паузу
 *
 * @type {boolean}
 */
let varPause = false;

/**
 * Флаг условия изменения роута
 *
 * @type {boolean}
 */
let varPush = false;

/**
 * Процедура обновления роутера, если страница появилась в области видимости
 *
 * @type {Function}
 * @param {Array} entries - Массив объектов, описывающих пересечения
 * @param {object} entries."0" - Первый и единственный объект, описывающий
 *   пересечение
 */
const fncIntersectionObserver = ([
  {
    isIntersecting = false,
    target: { id: name = crypto.randomUUID() } = {},
  } = {},
] = []) => {
  if (!varPause && isIntersecting && name !== get(cmpThe, "id")) {
    varPush = true;
    router?.push({ name });
  }
};

/**
 * Loop slides on end
 *
 * @type {boolean}
 * @see {@link https://github.com/biati-digital/glightbox} см. документацию
 */
const loop = true;

/**
 * Enable or disable zoomable images you can also use data-zoomable="false" on
 * individual nodes.
 *
 * @type {boolean}
 * @see {@link https://github.com/biati-digital/glightbox} см. документацию
 */
const zoomable = false;

/**
 * Функция преобразования в селектор для href
 *
 * @type {Function}
 * @param {string} el - Селектор
 * @returns {string} Преобразованный селектор
 */
const fncSelectors = (el = '=""') => `a[href${el}]`;

/**
 * Name of the selector for example '.glightbox' or 'data-glightbox' or
 * '*[data-glightbox]'
 *
 * @type {string}
 * @see {@link https://github.com/biati-digital/glightbox} см. документацию
 */
const selector = selectors?.map(fncSelectors)?.join();

/**
 * Массив страниц, отображаемых на экране
 *
 * @type {ref}
 */
const refElements = ref([]);

/**
 * Функция поиска элемента соответствующего текущему объекту страницы
 *
 * @type {Function}
 * @param {ref} element - Элемент
 * @param {string} element.id - Id элемента
 * @returns {boolean} Признак совпадения id
 */
const fncCurrentElement = ({ id = crypto.randomUUID() } = {}) =>
  id === get(cmpThe, "id");

/**
 * Вычисление текущего элемента, соответствующего текущему объекту страницы
 *
 * @type {computed}
 * @see {@link fncCurrentElement} см. поисковую функцию
 */
const cmpCurrentElement = useArrayFind(refElements, fncCurrentElement);

/**
 * Процедура, вызываемая при изменении состава страниц на экране
 *
 * @type {Function}
 */
const fncPromises = async () => {
  await Promise.all(get(cmpMountedPromises));
  GLightbox({ loop, zoomable, selector });
};

/**
 * Процедура, вызываемая при изменении роута
 *
 * @type {Function}
 */
const fncRoute = async () => {
  if (!varPush) {
    await Promise.all(get(cmpMountedPromises));
    varPause = true;
    unrefElement(cmpCurrentElement)?.scrollIntoView({
      behavior: "instant",
    });
    varPause = false;
  } else varPush = false;
};

watchEffect(fncPromises);
watch(route, fncRoute, { immediate: true });
</script>
