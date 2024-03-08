<template lang="pug">
.flex.snap-start(
  v-for="the in siblings",
  :id="the.id",
  :key="the.id",
  ref="refs",
  v-intersection-observer="[onIntersectionObserver,{root,rootMargin:'-1px 0px -100%',threshold:0}]",
  :class="{ 'min-h-full': the.full }"
)
  .prose.max-w-none.flex-auto.text-sm(
    class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    :data-theme="the.theme",
    :role="the.id === selectedObject.id ? 'main' : undefined",
    un-cloak
  )
    component(:is="theTemplate[the.id]", :the="the", :mdi="mdi")
</template>
<script setup>
import * as mdi from "@mdi/js";
import { vIntersectionObserver } from "@vueuse/components";
import {
  get,
  unrefElement,
  useArrayFind,
  useArrayFindIndex,
  useArrayMap,
  useParentElement,
  watchDeep,
} from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import selectors from "@/assets/glightbox.json";
/**
 * Хранилище приложения монолит
 *
 * @typedef {object} appStore
 * @property {Function} getTemplate - Функция, возвращающая Promise на
 *   сконструированный шаблон
 */
import app from "@/stores/app";
/**
 * Хранилище данных приложения монолит
 *
 * @typedef {object} dataStore
 * @property {Array} pages - Общий массив всех объектов страниц сайта
 */
import data from "@/stores/data";

/** @type {appStore} */
const appStore = app();

/** @type {appStore} */
const { getTemplate } = appStore;

/** @type {dataStore} */
const dataStore = data();

/** @type {dataStore} */
const { pages } = storeToRefs(data());

/**
 * Текущий ройт сайта
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
 * Родительский элемент представления
 *
 * @type {ref}
 */
const root = useParentElement();

/**
 * Функция проверки совпадения Id объекта страницы с названием роута
 *
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @returns {boolean} Признак совпадения с названием текущего роута
 */
const selectedObjectIndexFn = ({ id }) => id === route.name;

/**
 * Порядковый номер выбранной странице в общем массиве всех объектов страниц
 * сайта
 *
 * @type {computed}
 */
const selectedObjectIndex = useArrayFindIndex(pages, selectedObjectIndexFn);

/** @returns {object} */
const selectedObjectFn = () =>
  get(selectedObjectIndex)
    ? get(pages, get(selectedObjectIndex))
    : get(pages, 0).children?.[0];
/**
 * SelectedObject
 *
 * @type {computed}
 */
const selectedObject = computed(selectedObjectFn);
/** @returns {Array} - Родственники */
const siblingsFn = () => get(selectedObject)?.siblings;
/**
 * Siblings
 *
 * @type {computed}
 */
const siblings = computed(siblingsFn);
/**
 * @param root0
 * @param root0.id
 * @param root0.template
 * @param root0.script
 * @param root0.style
 */
const theTemplateEntriesFn = ({ id, template, script, style }) => [
  id,
  getTemplate({ id, template, script, style }),
];
/**
 * TheTemplateEntries
 *
 * @type {computed}
 */
const theTemplateEntries = useArrayMap(siblings, theTemplateEntriesFn);
/**
 * @param root0
 * @param root0."0"
 * @param root0."1"
 */
const theTemplateArrayFn = ([key, value]) => [
  key,
  defineAsyncComponent(() => value),
];
/**
 * TheTemplateArray
 *
 * @type {computed}
 */
const theTemplateArray = useArrayMap(theTemplateEntries, theTemplateArrayFn);
/**
 * TheTemplate
 *
 * @type {computed}
 */
const theTemplate = computed(() => Object.fromEntries(get(theTemplateArray)));
/**
 * Refs
 *
 * @type {ref}
 */
const refs = ref([]);
/**
 * @param root0
 * @param root0.id
 */
const scrollToElementCurrentFn = ({ id }) => id === get(selectedObject, "id");
/**
 * ScrollToElementCurrent
 *
 * @type {computed}
 */
const scrollToElementCurrent = useArrayFind(refs, scrollToElementCurrentFn);
/**
 * Pause
 *
 * @type {boolean}
 */
let pause = false;
/**
 * @param {Array} entries - Массив объектов, описывающих пересечения
 * @param {object} entries."0" - Первый и единственный объект, описывающий
 *   пересечение
 */
const onIntersectionObserver = ([
  {
    isIntersecting,
    target: { id: name },
  },
]) => {
  if (!pause && isIntersecting && name !== get(selectedObject, "id"))
    router.push({ name });
};
/** TouchNavigation */
const touchNavigation = true;
/** Loop */
const loop = true;
/** AutoplayVideos */
const autoplayVideos = true;
/** Zoomable */
const zoomable = false;
/** @param el */
const hrefSelectors = (el) => `a[href${el}]`;
/** Selector */
const selector = selectors.map(hrefSelectors).join();
/** Options */
const options = { touchNavigation, loop, autoplayVideos, zoomable, selector };
/** Скролл */
const onRenderComplete = async () => {
  await nextTick();
  GLightbox(options);
  unrefElement(scrollToElementCurrent).scrollIntoView({
    behavior: "instant",
  });
  pause = false;
};
/** Когда дом изменился */
const onChangeRefs = async () => {
  pause = true;
  await Promise.all(Object.values(Object.fromEntries(get(theTemplateEntries))));
  setTimeout(onRenderComplete, 200);
};
watchDeep(refs, onChangeRefs);
</script>
