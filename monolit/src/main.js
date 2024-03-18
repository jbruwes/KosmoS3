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
import dataStore from "@/stores/data";
import unocssConfig from "~/uno.config";
// eslint-disable-next-line no-console
console.info(
  "👨‍🚀",
  "The kosmos3 framework",
  /* global __APP_VERSION__ */
  `ver:${__APP_VERSION__}`,
  "https://kosmos3.ru",
);
initUnocssRuntime({
  autoPrefix: true,
  defaults: unocssConfig,
  bypassDefined: true,
});
const app = createApp(App);
app.config.globalProperties.mdi = mdi;
app.use(createPinia());
const { cmpPages, settings } = storeToRefs(dataStore());
watch(
  cmpPages,
  (value) => {
    value.forEach(({ path, id: name, loc }) => {
      router.addRoute({
        name,
        path: `/${path}`,
        ...(loc && { alias: `/${encodeURI(loc.replace(" ", "_"))}` }),
        /** @returns {object} - MainView */
        component: () =>
          import(
            get(settings, "landing")
              ? "@/views/MultiView.vue"
              : "@/views/SingleView.vue"
          ),
      });
    });
    router.addRoute({
      path: "/:catchAll(.*)*",
      /** @returns {object} - Страница ошибки */
      component: () => import("@/views/NotFoundView.vue"),
    });
    router.replace(router.currentRoute.value.fullPath);
  },
  { once: true },
);
watch(
  settings,
  ({ metrika, analytics }) => {
    if (metrika)
      app.use(VueYandexMetrika, {
        id: metrika,
        router,
        env: "production",
      });
    if (analytics)
      app.use(
        VueGtag,
        {
          config: {
            id: analytics,
          },
        },
        router,
      );
  },
  { once: true },
);
app.use(router);
app.use(createHead());
app.use(Tres);
app.use(MotionPlugin);
app.component("VHead", Head);
app.mount("#app");
