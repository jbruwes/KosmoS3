import "@fontsource/arsenal";
import "@fontsource/bad-script";
import "@fontsource/caveat";
import "@fontsource/comfortaa";
import "@fontsource/cormorant-garamond";
import "@fontsource/cormorant-infant";
import "@fontsource/cormorant-sc";
import "@fontsource/cormorant-unicase";
import "@fontsource/cormorant";
import "@fontsource/jura";
import "@fontsource/marck-script";
import "@fontsource/montserrat";
import "@fontsource/montserrat-alternates";
import "@fontsource/open-sans-condensed";
import "@fontsource/open-sans";
import "@fontsource/oswald";
import "@fontsource/pattaya";
import "@fontsource/poiret-one";
import "@fontsource/roboto-condensed";
import "@fontsource/roboto-mono";
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import "@fontsource/rubik-mono-one";
import "@fontsource/rubik";
import "@fontsource/tenor-sans";
import "glightbox/dist/css/glightbox.css";
import "./style.css";

// import "@unocss/reset/tailwind.css";
import Tres from "@tresjs/core";
import { tsParticles } from "@tsparticles/engine";
import { loadBigCirclesPreset } from "@tsparticles/preset-big-circles";
import { loadBubblesPreset } from "@tsparticles/preset-bubbles";
import { loadConfettiPreset } from "@tsparticles/preset-confetti";
import { loadFirePreset } from "@tsparticles/preset-fire";
import { loadFireflyPreset } from "@tsparticles/preset-firefly";
import { loadFireworksPreset } from "@tsparticles/preset-fireworks";
import { loadFountainPreset } from "@tsparticles/preset-fountain";
import { loadHyperspacePreset } from "@tsparticles/preset-hyperspace";
import { loadLinksPreset } from "@tsparticles/preset-links";
import { loadSeaAnemonePreset } from "@tsparticles/preset-sea-anemone";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { loadSquaresPreset } from "@tsparticles/preset-squares";
import { loadStarsPreset } from "@tsparticles/preset-stars";
import { loadTrianglesPreset } from "@tsparticles/preset-triangles";
import { createHead } from "@unhead/vue";
import { Head } from "@unhead/vue/components";
// import initUnocssRuntime from "@unocss/runtime";
import { watchOnce } from "@vueuse/core";
import { createPinia, storeToRefs } from "pinia";
import { createApp } from "vue";
import VueGtag from "vue-gtag";
import VueYandexMetrika from "vue3-yandex-metrika";

// import unocssConfig from "~/uno.config";
import App from "./App.vue";
import VParticles from "./components/VParticles.vue";
import router from "./router";
import dataStore from "./stores/data";

// eslint-disable-next-line no-console
console.info(
  "👨‍🚀",
  "The kosmos3 framework",
  /* global __APP_VERSION__ */
  `ver:${__APP_VERSION__}`,
  "https://kosmos3.ru",
);
tsParticles.init();
loadBigCirclesPreset(tsParticles);
loadBubblesPreset(tsParticles);
loadConfettiPreset(tsParticles);
loadFirePreset(tsParticles);
loadFireflyPreset(tsParticles);
loadFireworksPreset(tsParticles);
loadFountainPreset(tsParticles);
loadHyperspacePreset(tsParticles);
loadLinksPreset(tsParticles);
loadSeaAnemonePreset(tsParticles);
loadSnowPreset(tsParticles);
loadSquaresPreset(tsParticles);
loadStarsPreset(tsParticles);
loadTrianglesPreset(tsParticles);
// initUnocssRuntime({
//   autoPrefix: true,
//   defaults: unocssConfig,
// });
const app = createApp(App);
app.use(createPinia());
const { flatTree, settings } = storeToRefs(dataStore());
app.use(router);
app.use(createHead());
app.use(Tres);
app.component("VHead", Head);
app.component("VParticles", VParticles);
app.mount("#app");
watchOnce(flatTree, (value) => {
  value.forEach(({ path, id: name, loc }) => {
    router.addRoute({
      name,
      path: `/${path}`,
      ...(loc && { alias: `/${encodeURI(loc.replace(" ", "_"))}` }),
      /** @returns {object} - MainView */
      component: () => import("./views/MainView.vue"),
    });
  });
  router.addRoute({
    path: "/:catchAll(.*)*",
    /** @returns {object} - Страница ошибки */
    component: () => import("./views/NotFoundView.vue"),
  });
  router.replace(router.currentRoute.value.fullPath);
});
watchOnce(settings, ({ metrika, analytics }) => {
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
});
