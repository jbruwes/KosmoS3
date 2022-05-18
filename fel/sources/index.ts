import "core-js/stable";
import "regenerator-runtime/runtime";

import "kendo-ui-core/css/web/kendo.common.css";
import "kendo-ui-core/css/web/kendo.default.css";
import "glightbox/dist/css/glightbox.css";
import "fomantic-ui-css/semantic.css";
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

// import "vuetify/dist/vuetify.min.css";

import "./styles/index.css";

import "fomantic-ui-css/semantic";
import "kendo-ui-core/js/kendo.menu";
import "lightslider";
import "pure";

import { createApp } from "vue";
import { createVuetify } from "vuetify";
// import * as components from "vuetify/lib/components";
// import * as directives from "vuetify/lib/directives";
import LoadScript from "vue-plugin-load-script";
import App from "./App.vue";

(window as any).$ = $;
(window as any).jQuery = jQuery;
$.ajaxSetup({ cache: false });

document.addEventListener("click", (event) => {
  const element = event.target as HTMLAnchorElement;
  if (
    element.tagName.toLowerCase() === "a" &&
    element.getAttribute("href")!.indexOf("#") === 0
  )
    element.href =
      window.location.href.split("#")[0] + element.getAttribute("href");
});

const app = createApp(App);
const vuetify = createVuetify({
  // components,
  // directives,
});
app.use(vuetify);
app.use(LoadScript);
app.mount("body");
