import "core-js/stable";
import "regenerator-runtime/runtime";

import "kendo-ui-core/css/web/kendo.common.css";
import "kendo-ui-core/css/web/kendo.default.css";
import "glightbox/dist/css/glightbox.css";
import "fomantic-ui-css/semantic.css";
import "animate.css/animate.css";
import "hover.css/css/hover.css";
import "aos/dist/aos.css";
import "lightslider/dist/css/lightslider.css";
import "jarallax/dist/jarallax.css";

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

import "./styles/index.css";

import "fomantic-ui-css/semantic";
import "kendo-ui-core/js/kendo.menu";
import "lightslider";
import "pure";
import "onpushstate";
import { createApp } from "vue";
import page from "page";
import onhashchange from "./modules/onhashchange";
import glightbox from "./modules/glightbox";
import cont from "./modules/cont";
import sidebar from "./modules/sidebar";

window.$ = $;
window.jQuery = jQuery;
if (!window.location.origin)
  window.location.origin = `${window.location.protocol}//${
    window.location.hostname
  }${window.location.port ? `:${window.location.port}` : ""}`;
$.ajaxSetup({ cache: false });

createApp({
  /**
   * @returns {object} Объект data
   */
  data: () => ({
    index: null,
    scripts: null,
  }),
  /**
   *
   */
  async created() {
    // jarallaxVideo();
    glightbox("body");
    AOS.init();
    [this.index, this.scripts] = await Promise.all([
      (await fetch("index.json", { cache: "no-store" })).json(),
      (await fetch("index.cdn.json", { cache: "no-store" })).json(),
    ]);
    this.scripts = this.scripts.map((val) =>
      Object.prototype.hasOwnProperty.call(val, "url") && val.url
        ? $.getScript(val.url)
        : false
    );
    this.scripts.push($.getScript("index.js"));
    sidebar(this.index);
    $(window).on("popstate pushstate", () => cont(this.scripts, this.index));
    if (window.location !== window.parent.location)
      $(window).trigger("popstate");
    onhashchange(this.scripts, this.index, "body>.pusher");
  },
}).mount("body");
