import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { createRouter, createMemoryHistory } from "vue-router";
import { loadFonts } from "./plugins/webfontloader";

import HomeView from "./components/HomeView.vue";
import AboutView from "./components/AboutView.vue";

loadFonts();

createApp(App)
  .use(vuetify)
  .use(
    createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: HomeView },
        { path: "/about", component: AboutView },
      ],
    })
  )
  .mount("#app");
