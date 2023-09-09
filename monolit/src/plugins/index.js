/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import VueAnimateOnScroll from "vue3-animate-onscroll";
import Particles from "vue3-particles";

import pinia from "../store";
import head from "../store/head";
import vuetify from "./vuetify";

/**
 *
 * @param {object} app - Объект приложения
 */
function registerPlugins(app) {
  app.use(vuetify).use(pinia).use(head).use(Particles).use(VueAnimateOnScroll);
}

export default registerPlugins;
