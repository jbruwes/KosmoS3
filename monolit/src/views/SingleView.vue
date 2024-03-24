<template lang="pug">
.flex.snap-start(:id="the?.id", :class="{ 'min-h-full': the?.full }")
  .prose.w-full.max-w-none.flex-auto.text-sm(
    v-cloak,
    class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    :data-theme="the?.theme",
    role="main"
  )
    component(
      :is="template",
      :the="the",
      @vue:mounted="GLightbox({ loop, zoomable, selector })"
    )
</template>
<script setup>
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
const { fncTemplate } = app();

/** @type {strData} */
const { pages } = storeToRefs(data());

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
 * Вычисление переадресации корневого объекта страницы на первый доступный
 * объект страницы
 *
 * @type {computed}
 */
const the = computed(() => {
  const index = pages?.value?.findIndex(
    ({ id = crypto?.randomUUID() } = {}) => id === route?.name,
  );
  const ret = pages?.value?.[index];
  return index ? ret : ret?.children?.[0];
});

/**
 * Вычисление объекта загруженных шаблонов
 *
 * @type {computed}
 */
const template = computed(() => fncTemplate(the?.value));

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
 * Name of the selector for example '.glightbox' or 'data-glightbox' or
 * '*[data-glightbox]'
 *
 * @type {string}
 * @see {@link https://github.com/biati-digital/glightbox} см. документацию
 */
const selector = selectors?.map((el = '=""') => `a[href${el}]`)?.join();
</script>
