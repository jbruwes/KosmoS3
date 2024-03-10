<template lang="pug">
.flex.snap-start(
  v-for="the in cmpCurrent?.siblings",
  v-cloak,
  :id="the.id",
  :key="the.id",
  ref="refElements",
  v-intersection-observer="[fncIntersectionObserver,{root,rootMargin,threshold}]",
  :class="{ 'min-h-full': the.full }"
)
  .prose.max-w-none.flex-auto.text-sm(
    class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    :data-theme="the.theme",
    :role="the.id === cmpCurrent.id ? 'main' : undefined"
  )
    component(
      :is="cmpTemplates[the.id]",
      :the="the",
      :mdi="mdi",
      @vue:mounted="cmpMounted[the.id].resolve()"
    )
</template>
<script setup>
import * as mdi from "@mdi/js";
import { vIntersectionObserver } from "@vueuse/components";
import {
  get,
  unrefElement,
  useArrayFind,
  useArrayFindIndex,
  useParentElement,
  watchDeep,
} from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref } from "vue";
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
 * @property {computed} cmpPages - Общий массив всех объектов страниц сайта
 */
import data from "@/stores/data";

/** @type {strApp} */
const strApp = app();

/** @type {strApp} */
const { fncTemplate } = strApp;

/** @type {strData} */
const strData = data();

/** @type {strData} */
const { cmpPages } = storeToRefs(data());

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
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @returns {boolean} Признак совпадения с названием текущего роута
 */
const fncCurrentIndex = ({ id }) => id === route.name;

/**
 * Порядковый номер выбранной страницы в общем массиве всех объектов страниц
 * сайта
 *
 * @type {computed}
 * @see {@link fncCurrentIndex} См. поисковую функцию
 */
const cmpCurrentIndex = useArrayFindIndex(cmpPages, fncCurrentIndex);

/**
 * Функция вычисления переадрессации корневого объекта страницы на первый
 * доступный объект страницы
 *
 * @returns {object} Объект страницы
 */
const fncCurrent = () =>
  get(cmpCurrentIndex)
    ? get(cmpPages, get(cmpCurrentIndex))
    : get(cmpPages, 0).children?.[0];

/**
 * Вычисление переадресации корневого объекта страницы на первый доступный
 * объект страницы
 *
 * @type {computed}
 * @see {@link fncCurrent} См. функцию вычисления переадресации
 */
const cmpCurrent = computed(fncCurrent);

/**
 * Функция вычисления элемента с промисом
 *
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @returns {[
 *   string,
 *   { promise: Promise; resolve: Function; reject: Function },
 * ]}
 *   Идентифицированный элемент с промисом
 */
const fncMounted = ({ id }) => [id, Promise.withResolvers()];

/**
 * Вычисление идентифицированного объекта промисов
 *
 * @type {computed}
 * @see {@link fncMounted} см. ф-цию вычисления
 */
const cmpMounted = computed(() =>
  Object.fromEntries(get(cmpCurrent, "siblings").map(fncMounted)),
);

/**
 * Функция вычисления элементов массива с готовыми шаблонами
 *
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @param {string} page.template - Шаблон страницы
 * @param {string} page.script - Скрипты страницы
 * @param {string} page.style - Стили страницы
 * @returns {[string, object]} Массив из id и готового шаблона
 */
const fncTemplateEntries = ({ id, template, script, style }) => [
  id,
  fncTemplate({ id, template, script, style }),
];

/**
 * Функция вычисления преобразования массива загруженных шаблонов в объект
 *
 * @returns {object} Объект с загруженных шаблонов
 * @see {@link fncTemplateEntries} см. функцию вычисления
 */
const fncTemplates = () =>
  Object.fromEntries(get(cmpCurrent, "siblings").map(fncTemplateEntries));

/**
 * Вычисления объекта загруженных шаблонов
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
const rootMargin = "-0.1% 0px -99.9%";

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
 * Процедура обновления роутера, если страница появилась в области видимости
 *
 * @param {Array} entries - Массив объектов, описывающих пересечения
 * @param {object} entries."0" - Первый и единственный объект, описывающий
 *   пересечение
 */
const fncIntersectionObserver = ([
  {
    isIntersecting,
    target: { id: name },
  },
]) => {
  if (!varPause && isIntersecting && name !== get(cmpCurrent, "id"))
    router.push({ name });
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
 * @param {string} el - Селектор
 * @returns {string} Преобразованный селектор
 */
const fncSelectors = (el) => `a[href${el}]`;

/**
 * Name of the selector for example '.glightbox' or 'data-glightbox' or
 * '*[data-glightbox]'
 *
 * @type {string}
 * @see {@link https://github.com/biati-digital/glightbox} см. документацию
 */
const selector = selectors.map(fncSelectors).join();

/**
 * Массив страниц, отображаемых на экране
 *
 * @type {ref}
 */
const refElements = ref([]);

/**
 * Функция поиска элемента соответствующего текущему объекту страницы
 *
 * @param {ref} element - Элемент
 * @param {string} element.id - Id элемента
 * @returns {boolean} Признак совпадения id
 */
const fncCurrentElement = ({ id }) => id === get(cmpCurrent, "id");

/**
 * Вычисление текущего элемента, соответствующего текущему объекту страницы
 *
 * @type {computed}
 * @see {@link fncCurrentElement} см. поисковую функцию
 */
const cmpCurrentElement = useArrayFind(refElements, fncCurrentElement);

/**
 * Функция получения промиса из объекта
 *
 * @param {object} PromiseWithResolvers - Объект, содержащий промис
 * @param {Promise} PromiseWithResolvers.promise - Промис
 * @returns {Promise} Промис
 */
const getPromise = ({ promise }) => promise;

/** Процедура, вызываемая при изменении состава страниц на экране */
const fncWatchRefElements = async () => {
  varPause = true;
  await Promise.all(Object.values(get(cmpMounted)).map(getPromise));
  await nextTick();
  GLightbox({ loop, zoomable, selector });
  unrefElement(cmpCurrentElement).scrollIntoView({
    behavior: "instant",
  });
  await nextTick();
  varPause = false;
};

watchDeep(refElements, fncWatchRefElements);
</script>
