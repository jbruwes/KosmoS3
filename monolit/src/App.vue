<template lang="pug">
v-head
  title {{ cmpThe?.name || " " }}
  link(
    v-for="currentCss in cmpVisibleCss",
    :key="currentCss?.id",
    crossorigin,
    rel="stylesheet",
    :href="currentCss?.url"
  )
  component(
    :is="'script'",
    v-for="currentJs in cmpVisibleJs",
    :key="currentJs?.id",
    crossorigin,
    deffer,
    :src="currentJs?.url"
  )
  meta(
    v-if="cmpThe?.description",
    name="description",
    :content="cmpThe?.description"
  )
  meta(v-if="cmpThe?.name", property="og:title", :content="cmpThe?.name")
  meta(v-if="cmpThe?.type", property="og:type", :content="cmpThe?.type")
  meta(v-if="cmpCanonical", property="og:url", :content="cmpCanonical")
  meta(v-if="cmpThe?.image", property="og:image", :content="cmpThe?.image")
  meta(v-if="cmpThe?.alt", property="og:image:alt", :content="cmpThe?.alt")
  link(
    :key="refFavicon",
    rel="icon",
    :href="`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${mdi?.[cmpThe?.favicon ?? 'mdiWeb']}'/></svg>`",
    type="image/svg+xml"
  )
  link(v-if="cmpCanonical", rel="canonical", :href="cmpCanonical")
  component(:is="'style'", v-if="style") {{ style }}
  component(:is="'script'", v-if="script") {{ `try{${script}\n}catch(e){console.error(\`\${e.name}: \${e.message}\`)}` }}
  meta(
    v-if="settings?.yandex",
    name="yandex-verification",
    :content="settings?.yandex"
  )
  meta(
    v-if="settings?.google",
    name="google-site-verification",
    :content="settings?.google"
  )
.drawer.h-dvh
  input#drawer.drawer-toggle(
    v-model="refDrawer",
    type="checkbox",
    aria-labelledby="#drawer"
  )
  .drawer-content.snap-y.snap-mandatory.overflow-y-auto.scroll-smooth(
    @scroll.passive="start"
  )
    .z-40(
      v-if="pages?.[0]?.visible",
      :class="[...(ready ? [] : navbar?.scrollClasses ?? []), ...(navbar?.classes ?? [])]",
      :data-theme="navbar?.theme"
    )
      .navbar
        component(:is="cmpNavbar", :the="cmpThe", :mdi="mdi")
    router-view
  .drawer-side.z-50(v-if="pages?.[0]?.visible")
    label.drawer-overlay(for="drawer")
    .grid.max-w-full.self-stretch.overflow-x-auto.scroll-smooth(
      :class="{ 'justify-self-stretch': pages?.[0]?.full }"
    )
      .col-start-1.row-start-1.flex
        .prose.w-full.max-w-none.flex-auto.text-sm(
          class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
          :data-theme="pages?.[0]?.theme"
        )
          component(:is="cmpRootTemplate", :the="pages?.[0]", :mdi="mdi")
      label.btn.btn-circle.btn-ghost.sticky.right-1.top-1.col-start-1.row-start-1.justify-self-end(
        for="drawer"
      )
        svg.h-6.w-6
          path(:d="mdi?.mdiClose")
</template>
<script setup>
/**
 * Реактивный setTimeout
 *
 * @typedef {object} useTimeout
 * @property {computed} ready - Флаг готовности
 * @property {Function} start - Ф-ция запуска
 * @see {@link https://vueuse.org/shared/useTimeout/}
 */
import {
  get,
  isDefined,
  set,
  useArrayFilter,
  useArrayFind,
  useBrowserLocation,
  useTimeout,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

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
 * @property {computed} css - Массив ссылок на стили
 * @property {computed} js - Массив ссылок на скрипты
 * @property {ref} uri - Путь до data.json
 * @property {computed} script - Глобальный скрипт
 * @property {computed} style - Глобальные стили
 * @property {computed} settings - Настройки
 * @property {computed} navbar - Навбар
 */
import data from "@/stores/data";

/** @type {strApp} */
const strApp = app();

/** @type {strApp} */
const { fncTemplate } = strApp;

/** @type {strData} */
const strData = data();

/** @type {strData} */
const { pages, css, js, uri, script, style, settings, navbar } =
  storeToRefs(strData);

/**
 * Reactive browser location
 *
 * @see {@link https://vueuse.org/core/useBrowserLocation/} - см. документацию
 */
const refLocation = useBrowserLocation();

/** @type {useTimeout} */
const { ready, start } = useTimeout(1000, { controls: true });

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
 * Ф-ция вычисления готового шаблона корневой страницы
 *
 * @type {Function}
 * @returns {object} - Готовый шаблон корневой страницы
 */
const fncRootTemplate = () => fncTemplate(get(pages, 0));

/**
 * Вычисление шаблона корневой страницы
 *
 * @type {computed}
 * @see {@link fncRootTemplate} - см. ф-цию вычисления
 */
const cmpRootTemplate = computed(fncRootTemplate);

/**
 * Ф-ция вычисления готового шаблона навбара
 *
 * @type {Function}
 * @returns {object} - Готовый шаблон навбара
 */
const fncNavbar = () =>
  fncTemplate({
    id: "navbar",
    template: get(navbar, "template"),
    script: get(navbar, "script"),
    style: get(navbar, "style"),
    setup: get(navbar, "setup"),
    scoped: get(navbar, "scoped"),
    path: "/",
  });

/**
 * Вычисление навбара
 *
 * @type {computed}
 * @see {@link fncNavbar} - см. ф-цию вычисления
 */
const cmpNavbar = computed(fncNavbar);

/**
 * Функция проверки совпадения Id объекта страницы с названием роута
 *
 * @type {Function}
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @returns {boolean} Признак совпадения с названием текущего роута
 */
const fncThe = ({ id = crypto.randomUUID() } = {}) => id === route?.name;

/**
 * Поиск текущего объекта страницы
 *
 * @type {computed}
 */
const cmpThe = useArrayFind(pages, fncThe);

/**
 * Ссылка на переключатель панели
 *
 * @type {ref}
 */
const refDrawer = ref(false);

/**
 * Ф-ция вычисления канонического пути
 *
 * @type {Function}
 * @returns {string} - Канонический путь
 */
const fncCanonical = () =>
  isDefined(cmpThe)
    ? `${get(refLocation, "origin")}/${get(cmpThe, "urn")}`
    : "";

/**
 * Вычисление канонического пути
 *
 * @type {computed}
 */
const cmpCanonical = computed(fncCanonical);

/**
 * Уникальный ключ для favicon. Иначе иконка динамически не обновляется в chrome
 * при смене страницы
 *
 * @type {ref}
 */
const refFavicon = ref(crypto.randomUUID());

/**
 * Функция фильтрации видимости ссылок
 *
 * @type {Function}
 * @param {object} link - Объект ссылки
 * @param {boolean} link.visible - Признак использования
 * @param {string} link.url - Урл
 * @returns {boolean} - Флаг использования ссылки
 */
const fncVisible = ({ visible = true, url = "" } = {}) => visible && url;

/**
 * Фильтр глобальных скриптов по видимости
 *
 * @type {computed}
 */
const cmpVisibleJs = useArrayFilter(js, fncVisible);

/**
 * Фильтр глобальных стилей по видимости
 *
 * @type {computed}
 */
const cmpVisibleCss = useArrayFilter(css, fncVisible);

/**
 * Функция, зарывающая левую панель перед каждым переходом на новую ссылку
 *
 * @type {Function}
 */
const fncRouterBeforeEach = () => {
  set(refDrawer, false);
};

router.beforeEach(fncRouterBeforeEach);
set(uri, "");
</script>
