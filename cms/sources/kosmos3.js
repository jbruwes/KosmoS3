import "core-js/stable";
import "regenerator-runtime/runtime";

import "webix/webix.css";
import "./styles/app.css";
import "fomantic-ui-css/components/icon.css";
import "@mdi/font/css/materialdesignicons.css";
import { JetApp, EmptyRouter } from "webix-jet";
import * as webix from "webix";

/**
 *
 */
export default class KosmoS3 extends JetApp {
  /**
   * @param config
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
if (!BUILD_AS_MODULE) {
  webix.ready(() => {
    webix.i18n.setLocale("ru-RU");
    webix.ui.fullScreen();
    const app = new KosmoS3();
    /**
     *
     */
    const size = () => (document.body.offsetWidth > 964 ? "wide" : "small");
    app.config.size = size();
    app.render();
  });
}
