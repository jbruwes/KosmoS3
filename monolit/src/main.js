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
// import { loadSlim } from "@tsparticles/slim";
import Particles from "@tsparticles/vue3";
import { createHead } from "@unhead/vue";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import VVanta from "./components/VVanta.vue";
import router from "./router";

const app = createApp(App);
app
  .use(createPinia())
  .use(router)
  .use(createHead())
  .use(Particles, {
    /** @param {object} engine - Движок для партиклов */
    init: async (engine) => {
      await Promise.all([
        loadBigCirclesPreset(engine),
        loadBubblesPreset(engine),
        loadConfettiPreset(engine),
        loadFirePreset(engine),
        loadFireflyPreset(engine),
        loadFireworksPreset(engine),
        loadFountainPreset(engine),
        loadHyperspacePreset(engine),
        loadLinksPreset(engine),
        loadSeaAnemonePreset(engine),
        loadSnowPreset(engine),
        loadSquaresPreset(engine),
        loadStarsPreset(engine),
        loadTrianglesPreset(engine),
      ]);
    },
  });
app.component("VVanta", VVanta);
app.mount("#app");
