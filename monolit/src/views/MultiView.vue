<template lang="pug">
.flex.snap-start(
  v-for="a in siblings",
  :id="a?.id",
  :key="a?.id",
  ref="refs",
  v-intersection-observer="[callback,{root,rootMargin,threshold}]",
  :class="{ 'min-h-full': a?.full }"
)
  .prose.w-full.max-w-none.flex-auto.text-sm(
    v-cloak,
    class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    :data-theme="a?.theme",
    :role="a?.id === the?.id ? 'main' : null"
  )
    component(
      :is="templates?.[a?.id]",
      :the="a",
      @vue:mounted="promises?.[a?.id]?.resolve"
    )
</template>
<script setup>
import { vIntersectionObserver } from "@vueuse/components";
import { useParentElement } from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import selectors from "@/assets/glightbox.json";
/**
 * Хранилище данных приложения монолит
 *
 * @typedef {object} strData
 * @property {computed} pages - Общий массив всех объектов страниц сайта
 */
import data from "@/stores/data";
/**
 * Хранилище приложения монолит
 *
 * @typedef {object} strApp
 * @property {Function} fncTemplate - Функция, возвращающая Promise на
 *   сконструированный шаблон
 */
import monolit from "@/stores/monolit";

/** @type {strApp} */
const { fncTemplate } = monolit();

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
 * Вычисление текущего объекта с учетом переадресации корневого объекта страницы
 * на первый доступный объект страницы
 *
 * @type {computed}
 */
const the = computed(() => {
  /**
   * Позиция текущей страницы в массиве страниц
   *
   * @type {number}
   */
  const index = pages?.value?.findIndex(
    ({ id = "" } = {}) => id === route?.name,
  );
  /**
   * Вычисленный текущий объект
   *
   * @type {object}
   */
  const ret = pages?.value?.[index];

  return index ? ret : ret?.children?.[0];
});

/**
 * Вычисление массива видимых объектов страниц с одинаковым предком
 *
 * @type {computed}
 */
const siblings = computed(() =>
  the?.value?.siblings?.filter(({ visible = true } = {}) => visible),
);

/**
 * Вычисление идентифицированного объекта промисов
 *
 * @type {computed}
 */
const promises = computed(() =>
  Object.fromEntries(
    siblings?.value?.map(({ id = "" } = {}) => [id, Promise.withResolvers()]) ??
      [],
  ),
);

/**
 * Вычисление массива загруженных шаблонов
 *
 * @type {computed}
 */
const templates = computed(() =>
  Object.fromEntries(
    siblings?.value?.map((a = {}) => [a?.id, fncTemplate(a)]) ?? [],
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
let pause = false;

/**
 * Флаг условия изменения роута
 *
 * @type {boolean}
 */
let push = false;

/**
 * Процедура обновления роутера, если страница появилась в области видимости
 *
 * @type {Function}
 * @param {Array} entries - Массив объектов, описывающих пересечения
 * @param {object} entries."0" - Первый и единственный объект, описывающий
 *   пересечение
 */
const callback = ([
  { isIntersecting = false, target: { id: name = "" } = {} } = {},
] = []) => {
  if (!pause && isIntersecting && name !== the?.value?.id) {
    push = true;
    router.push({ name });
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
const selector = selectors?.map((el = "") => `a[href${el}]`)?.join();

/**
 * Массив страниц, отображаемых на экране
 *
 * @type {ref}
 */
const refs = ref([]);

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

/**
 * Процедура ожидания загрузки страниц
 *
 * @type {Function}
 */
const all = async () => {
  await Promise.all(
    Object.values(promises?.value ?? {})?.map(
      ({ promise = null } = {}) => promise,
    ),
  );
};

watch(
  siblings,
  async () => {
    await all();
    GLightbox({ loop, zoomable, selector });
  },
  { immediate },
);

watch(
  route,
  async () => {
    if (!push) {
      await all();
      pause = true;
      refs?.value
        ?.find(({ id = "" } = {}) => id === the?.value?.id)
        ?.scrollIntoView({ behavior });
      pause = false;
    } else push = false;
  },
  { immediate },
);
</script>
