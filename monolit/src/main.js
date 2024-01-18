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
import { useStyleTag, watchOnce } from "@vueuse/core";
import { createPinia, storeToRefs } from "pinia";
import * as Vue from "vue";
import { loadModule } from "vue3-sfc-loader";

import App from "./App.vue";
import VParticles from "./components/VParticles.vue";
import VVanta from "./components/VVanta.vue";
import router from "./router";
import dataStore from "./stores/data";

const { defineAsyncComponent, createApp } = Vue;
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
const app = createApp(App);
app.use(createPinia()).use(router).use(createHead());
app.component("VVanta", VVanta);
app.component("VParticles", VParticles);
app.mount("#app");

const { flatTree } = storeToRefs(dataStore());
watchOnce(flatTree, (value) => {
  value.forEach(({ id, script, style, template }) => {
    app.component(
      id,
      defineAsyncComponent(() =>
        loadModule(`/${id}.vue`, {
          moduleCache: {
            vue: Vue,
          },
          /** @returns {string} - Шаблон */
          getFile: () => `<script setup>const props=defineProps(["the","mdi"]);
        ${script ?? ""}</script><template>${
          template ?? ""
        }</template><style scoped>${style ?? ""}</style>`,
          /** @param {string} css - Стили */
          addStyle(css) {
            useStyleTag(css, { id: `vueuse_styletag_${id}` });
          },
          /**
           * @param {string} type - Тип записи
           * @param {...any} args - Содержимое записи
           */
          log(type, ...args) {
            // eslint-disable-next-line no-console
            console[type](...args);
          },
        }),
      ),
    );
  });
});
