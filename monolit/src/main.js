/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

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
import "animate.css/animate.css";

import "./styles/index.css";

// Components

// Composables
import { createApp } from "vue";

// Plugins
import registerPlugins from "@/plugins";
import App from "./App.vue";

document.addEventListener("click", (event) => {
  const element = event.target;
  const href = element.getAttribute("href");
  if (element.tagName.toLowerCase() === "a" && href && href.indexOf("#") === 0)
    element.href = window.location.href.split("#")[0] + href;
});

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
