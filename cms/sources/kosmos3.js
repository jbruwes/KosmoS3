import "core-js/stable";
import "regenerator-runtime/runtime";

import "webix/webix.css";
import "./styles/app.css";
import "@mdi/font/css/materialdesignicons.css";
import { JetApp, EmptyRouter } from "webix-jet";
import * as webix from "webix/webix.min";

/**
 * Основной класс приложения
 */
export default class KosmoS3 extends JetApp {
  /**
   * Конструктор
   *
   * @param {object} config Объект конфигурации
   */
  constructor(config) {
    const defaults = {
      id: APPNAME,
      version: VERSION,
      router: EmptyRouter,
      debug: !PRODUCTION,
      webix,
      start: "/top/signin",
    };
    super({
      ...defaults,
      ...config,
    });
  }
}
webix.ready(() => {
  webix.i18n.setLocale("ru-RU");
  webix.ui.fullScreen();
  const app = new KosmoS3();
  /**
   * Расчет адаптивной ширины
   *
   * @returns {string} Ширина
   */
  app.config.size = () => (document.body.offsetWidth > 964 ? "wide" : "small");
  app.render();
});
