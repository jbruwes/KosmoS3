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
import onhashchange from "./modules/onhashchange";
import glightbox from "./modules/glightbox";
import cont from "./modules/cont";
import sidebar from "./modules/sidebar";

window.$ = $;
window.jQuery = jQuery;
(async () => {
  /**
   * Объект с промисами подгружаемых скриптов
   *
   * @constant {Object<*>}
   */
  const scripts = {
    indexJs: $.Deferred(),
    indexJson: $.Deferred(),
    indexCdnJson: $.Deferred(),
  };
  /**
   * Структура вебсайта
   *
   * @type {object}
   */
  let index = {};
  /**
   * Массив промисов пользовательских подгружаемых скриптов
   *
   * @type {*[]}
   */
  let usrScripts = [];
  /**
   * Обработчик, запускаемый после загрузки документа
   */
  function readyFn() {
    glightbox("body");
    AOS.init();
    $.when(scripts.indexJson, scripts.indexCdnJson).done(() => {
      sidebar(index);
      $(window).on("popstate pushstate", () => {
        cont(usrScripts, scripts, index);
      });
      if (window.location !== window.parent.location) {
        $(window).trigger("popstate");
      }
      onhashchange(usrScripts, scripts, index, "body>.pusher");
    });
  }
  // jarallaxVideo();
  if (!window.location.origin) {
    window.location.origin = `${window.location.protocol}//${
      window.location.hostname
    }${window.location.port ? `:${window.location.port}` : ""}`;
  }
  $("<link>")
    .appendTo("head")
    .attr({ type: "text/css", rel: "stylesheet" })
    .attr("href", "index.cdn.css");
  $("<link>")
    .appendTo("head")
    .attr({ type: "text/css", rel: "stylesheet" })
    .attr("href", "index.css");
  $.ajaxSetup({ cache: false });
  $.getScript("index.js").done(scripts.indexJs.resolve);
  $.getJSON("index.json").done((data) => {
    index = data;
    scripts.indexJson.resolve();
  });
  $.getJSON("index.cdn.json").done((data) => {
    usrScripts = data.map((val) =>
      Object.prototype.hasOwnProperty.call(val, "url") && val.url
        ? $.getScript(val.url)
        : false
    );
    scripts.indexCdnJson.resolve();
  });
  if (document.readyState !== "loading") {
    readyFn();
  } else {
    document.addEventListener("DOMContentLoaded", readyFn);
  }
})();
