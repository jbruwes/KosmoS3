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
      @vue:mounted="cmpResolve?.[the?.id]?.resolve"
    )
</template>
<script setup>
import { vIntersectionObserver } from "@vueuse/components";
import { useParentElement } from "@vueuse/core";
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
const cmpThe = computed(() => {
  const index = pages?.value?.findIndex(
    ({ id = crypto.randomUUID() } = {}) => id === route?.name,
  );
  const ret = pages?.value?.[index];
  return index ? ret : ret?.children?.[0];
});

/**
 * Вычисление массива видимых объектов страниц с одинаковым предком
 *
 * @type {computed}
 */
const cmpSiblingsFilter = computed(() =>
  cmpThe?.value?.siblings?.filter(({ visible = true } = {}) => visible),
);

/**
 * Вычисление идентифицированного объекта промисов
 *
 * @type {computed}
 */
const cmpResolve = computed(() =>
  Object.fromEntries(
    cmpSiblingsFilter?.value?.map(({ id = crypto.randomUUID() } = {}) => [
      id,
      Promise.withResolvers(),
    ]),
  ),
);

/**
 * Вычисление плоского массива промисов
 *
 * @type {computed}
 */
const cmpMountedPromises = computed(() =>
  Object.values(cmpResolve?.value)?.map(({ promise = null } = {}) => promise),
);

/**
 * Вычисление объекта загруженных шаблонов
 *
 * @type {computed}
 */
const cmpTemplates = computed(() =>
  Object.fromEntries(
    cmpSiblingsFilter?.value?.map((the = {}) => [the?.id, fncTemplate(the)]),
  ),
);

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
  if (!varPause && isIntersecting && name !== cmpThe?.value?.id) {
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
 * Name of the selector for example '.glightbox' or 'data-glightbox' or
 * '*[data-glightbox]'
 *
 * @type {string}
 * @see {@link https://github.com/biati-digital/glightbox} см. документацию
 */
const selector = selectors?.map((el = '=""') => `a[href${el}]`)?.join();

/**
 * Массив страниц, отображаемых на экране
 *
 * @type {ref}
 */
const refElements = ref([]);

/**
 * Вычисление текущего элемента, соответствующего текущему объекту страницы
 *
 * @type {computed}
 */
const cmpCurrentElement = computed(() =>
  refElements?.value?.find(
    ({ id = crypto.randomUUID() } = {}) => id === cmpThe?.value?.id,
  ),
);

/**
 * Немедленное срабатывание смотрителя
 *
 * @type {boolean}
 */
const immediate = true;

/**
 * Быстрый скролл
 *
 * @type {string}
 */
const behavior = "instant";

watchEffect(async () => {
  await Promise.all(cmpMountedPromises?.value);
  GLightbox({ loop, zoomable, selector });
});
watch(
  route,
  async () => {
    if (!varPush) {
      await Promise.all(cmpMountedPromises?.value);
      varPause = true;
      cmpCurrentElement?.value?.scrollIntoView({ behavior });
      varPause = false;
    } else varPush = false;
  },
  { immediate },
);
</script>
