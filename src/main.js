import { createApp } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import HomeView from "./components/HomeView.vue";
import AboutView from "./components/AboutView.vue";

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
