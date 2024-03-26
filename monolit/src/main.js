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
const { pages } = storeToRefs(data());

/** @type {strData} */
const { $ } = data();

/**
 * Перевод яндекс метрики в продуктовый режим
 *
 * @type {string}
 */
const env = "production";

/**
 * Запуск вотчера единожды
 *
 * @type {boolean}
 */
const once = true;

watch(
  pages,
  (value) => {
    (() => {
      /**
       * Функция динамического импорта компонента
       *
       * @type {Function}
       * @returns {object} - Страница ошибки
       */
      const component = () =>
        import(
          $?.settings?.landing
            ? "@/views/MultiView.vue"
            : "@/views/SingleView.vue"
        );
      value.forEach(
        ({
          path: pPath = "",
          _: path = `/${pPath}`,
          id: name = "",
          loc = "",
        } = {}) => {
          /**
           * Подготовленный алиас
           *
           * @type {string}
           */
          const alias = `/${encodeURI(loc?.replace(" ", "_") ?? "")}`;

          router.addRoute({ name, path, ...(loc && { alias }), component });
        },
      );
    })();

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
     * @returns {object} - Страница ошибки
     */
    const component = () => import("@/views/NotFoundView.vue");

    router.addRoute({ path, component });
    router.replace(router.currentRoute.value.fullPath);
  },
  { once },
);
watch(
  () => $?.settings,
  ({ metrika, analytics }) => {
    if (metrika) {
      /**
       * Id метрики
       *
       * @type {string}
       */
      const id = metrika;

      app.use(VueYandexMetrika, { id, router, env });
    }
    if (analytics) {
      /**
       * Id аналитики
       *
       * @type {string}
       */
      const id = analytics;

      /**
       * Подготовленный конфиг
       *
       * @type {{ string }}
       */
      const config = { id };

      app.use(VueGtag, { config }, router);
    }
  },
  { once },
);
app.use(router);
app.use(createHead());
app.use(Tres);
app.use(MotionPlugin);
app.component("VHead", Head);
app.mount("#app");
