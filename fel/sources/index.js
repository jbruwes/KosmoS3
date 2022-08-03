import "core-js/stable";
import "regenerator-runtime/runtime";

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
import "lightslider/dist/css/lightslider.css";
import "jarallax/dist/jarallax.css";

// import "fomantic-ui-css/semantic.css";
import "fomantic-ui-css/components/accordion.css";
import "fomantic-ui-css/components/ad.css";
import "fomantic-ui-css/components/breadcrumb.css";
import "fomantic-ui-css/components/button.css";
import "fomantic-ui-css/components/calendar.css";
import "fomantic-ui-css/components/card.css";
import "fomantic-ui-css/components/checkbox.css";
import "fomantic-ui-css/components/comment.css";
import "fomantic-ui-css/components/container.css";
import "fomantic-ui-css/components/dimmer.css";
import "fomantic-ui-css/components/divider.css";
import "fomantic-ui-css/components/dropdown.css";
import "fomantic-ui-css/components/embed.css";
import "fomantic-ui-css/components/emoji.css";
import "fomantic-ui-css/components/feed.css";
import "fomantic-ui-css/components/flag.css";
import "fomantic-ui-css/components/form.css";
import "fomantic-ui-css/components/grid.css";
import "fomantic-ui-css/components/header.css";
import "fomantic-ui-css/components/icon.css";
import "fomantic-ui-css/components/image.css";
import "fomantic-ui-css/components/input.css";
import "fomantic-ui-css/components/item.css";
import "fomantic-ui-css/components/label.css";
import "fomantic-ui-css/components/list.css";
import "fomantic-ui-css/components/loader.css";
import "fomantic-ui-css/components/menu.css";
import "fomantic-ui-css/components/message.css";
import "fomantic-ui-css/components/modal.css";
import "fomantic-ui-css/components/nag.css";
import "fomantic-ui-css/components/placeholder.css";
import "fomantic-ui-css/components/popup.css";
import "fomantic-ui-css/components/progress.css";
import "fomantic-ui-css/components/rail.css";
import "fomantic-ui-css/components/rating.css";
// import "fomantic-ui-css/components/reset.css";
import "fomantic-ui-css/components/reveal.css";
import "fomantic-ui-css/components/search.css";
import "fomantic-ui-css/components/segment.css";
import "fomantic-ui-css/components/shape.css";
import "fomantic-ui-css/components/sidebar.css";
// import "fomantic-ui-css/components/site.css";
import "fomantic-ui-css/components/slider.css";
import "fomantic-ui-css/components/statistic.css";
import "fomantic-ui-css/components/step.css";
import "fomantic-ui-css/components/sticky.css";
import "fomantic-ui-css/components/tab.css";
import "fomantic-ui-css/components/table.css";
import "fomantic-ui-css/components/text.css";
import "fomantic-ui-css/components/toast.css";
import "fomantic-ui-css/components/transition.css";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "./styles/index.css";

import "fomantic-ui-css/semantic";
import "lightslider";
import "pure";

import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { MotionPlugin } from '@vueuse/motion'
import App from "./App.vue";

window.$ = $;
window.jQuery = jQuery;
$.ajaxSetup({ cache: false });

document.addEventListener("click", (event) => {
  const element = event.target;
  const href = element.getAttribute("href");
  if (element.tagName.toLowerCase() === "a" && href && href.indexOf("#") === 0)
    element.href = window.location.href.split("#")[0] + href;
});

const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives,
});
app.use(vuetify);
app.use(MotionPlugin);
app.use(createPinia());
app.mount("#app");
