/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";

/**
 *
 * @param {object} app - объект приложения
 */
export default function registerPlugins(app) {
  app.use(vuetify).use(router).use(pinia);
}
