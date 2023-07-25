/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import Particles from "vue3-particles";
import VueAnimateOnScroll from "vue3-animate-onscroll";
import vuetify from "./vuetify";
import pinia from "../store";
import head from "../store/head";

export function registerPlugins(app) {
  app.use(vuetify).use(pinia).use(head).use(Particles).use(VueAnimateOnScroll);
}
