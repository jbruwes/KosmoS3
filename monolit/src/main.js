import "glightbox/dist/css/glightbox.css";
import "./style.css";
import "@unocss/reset/tailwind.css";
import "daisyui/dist/full.css";
// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css";

import * as mdi from "@mdi/js";
import Tres from "@tresjs/core";
import { createHead } from "@unhead/vue";
// eslint-disable-next-line import/no-unresolved
import { Head } from "@unhead/vue/components";
import initUnocssRuntime from "@unocss/runtime";
import { get } from "@vueuse/core";
import { MotionPlugin } from "@vueuse/motion";
import { createPinia, storeToRefs } from "pinia";
import { createApp, watch } from "vue";
import VueGtag from "vue-gtag";
import VueYandexMetrika from "vue3-yandex-metrika";

import App from "@/App.vue";
import router from "@/router";
/**
 * Хранилище данных приложения монолит
 *
 * @typedef {object} strData
 * @property {object} pages - Общий массив всех объектов страниц сайта
 * @property {object} settings - Настройки
 */
import data from "@/stores/data";
import defaults from "~/uno.config";

// eslint-disable-next-line no-console
console.info(
  "👨‍🚀",
  "The vues3 framework",
  /* global __APP_VERSION__ */
  `ver:${__APP_VERSION__}`,
  "https://vues3.ru",
);

/**
 * Enable css property auto prefixer
 *
 * @type {boolean}
 */
const autoPrefix = true;

/**
 * When enabled, UnoCSS will look for the existing selectors defined in the
 * stylesheet and bypass them. This is useful when using the runtime alongwith
 * the build-time UnoCSS.
 *
 * @type {boolean}
 */
const bypassDefined = true;

initUnocssRuntime({ autoPrefix, defaults, bypassDefined });
const app = createApp(App);
app.config.globalProperties.mdi = mdi;
app.use(createPinia());

/** @type {strData} */
const strData = data();

/** @type {strData} */
const { pages, settings } = storeToRefs(strData);

/**
 * FncImportMainView
 *
 * @returns {object} - MainView
 */
const fncImportMainView = () =>
  import(
    get(settings, "landing")
      ? "@/views/MultiView.vue"
      : "@/views/SingleView.vue"
  );

/**
 * @param root0
 * @param root0.path
 * @param root0.id
 * @param root0.loc
 */
const fncEachPage = ({
  path = "",
  id: name = crypto.randomUUID(),
  loc = "",
} = {}) => {
  /**
   * Подготовленный алиас
   *
   * @type {string}
   */
  const alias = `/${encodeURI(loc?.replace(" ", "_"))}`;

  router.addRoute({
    name,
    path: `/${path}`,
    ...(loc && { alias }),
    component: fncImportMainView,
  });
};

/**
 * @type {Function}
 * @returns {object} - Страница ошибки
 */
const fncImportNotFoundView = () => import("@/views/NotFoundView.vue");

/**
 * Ф-ция наполнения роутера
 *
 * @type {Function}
 * @param {object} value - Объект страницы
 */
const fncPages = (value) => {
  value.forEach(fncEachPage);

  /**
   * Все неучтенные пути
   *
   * @type {string}
   */
  const path = "/:catchAll(.*)*";
  /**
   * Функция динамического импорта компонента
   *
   * @type {Function}
   */
  const component = fncImportNotFoundView;

  router.addRoute({ path, component });
  router.replace(router.currentRoute.value.fullPath);
};

/** @type {string} */
const env = "production";

/**
 * Ф-ция подключения метрики и/или аналитики
 *
 * @type {Function}
 * @param {object} settings - Объект с настройками
 * @param {string} settings.metrika - Id метрики
 * @param {string} settings.analytics - Id аналитики
 */
const fncSettings = ({ metrika, analytics }) => {
  if (metrika) {
    /** @type {string} */
    const id = metrika;
    app.use(VueYandexMetrika, { id, router, env });
  }
  if (analytics) {
    /** @type {string} */
    const id = analytics;
    /** @type {{ string }} */
    const config = { id };
    app.use(VueGtag, { config }, router);
  }
};

/**
 * Запуск вотчера единожды
 *
 * @type {boolean}
 */
const once = true;

watch(pages, fncPages, { once });
watch(settings, fncSettings, { once });
app.use(router);
app.use(createHead());
app.use(Tres);
app.use(MotionPlugin);
app.component("VHead", Head);
app.mount("#app");
