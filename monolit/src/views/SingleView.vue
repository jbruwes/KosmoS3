<template lang="pug">
.flex.snap-start(:id="cmpThe?.id", :class="{ 'min-h-full': cmpThe?.full }")
  .prose.w-full.max-w-none.flex-auto.text-sm(
    v-cloak,
    class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    :data-theme="cmpThe?.theme",
    role="main"
  )
    component(
      :is="cmpTheTemplate",
      :the="cmpThe",
      @vue:mounted="GLightbox({ loop, zoomable, selector })"
    )
</template>
<script setup>
import { get, useArrayFindIndex } from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import selectors from "@/assets/glightbox.json";
/**
 * Хранилище приложения монолит
 *
 * @typedef {object} strApp
 * @property {Function} fncTemplate - Функция, возвращающая сконструированный
 *   шаблон
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
 * Функция вычисления переадресации корневого объекта страницы на первый
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
 * Функция вычисления преобразования загруженного шаблонов в объект
 *
 * @type {Function}
 * @returns {object} Объект с загруженных шаблонов
 */
const fncTheTemplate = () => fncTemplate(get(cmpThe));

/**
 * Вычисление объекта загруженных шаблонов
 *
 * @type {computed}
 * @see {@link fncTheTemplate} см. функцию вычисления
 */
const cmpTheTemplate = computed(fncTheTemplate);

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
</script>
