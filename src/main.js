import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import HomeView from "./components/HomeView.vue";
import AboutView from "./components/AboutView.vue";
import ContentView from "./components/ContentView.vue";

createApp(App)
  .use(vuetify)
  .use(
    createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: HomeView },
        { path: "/about", component: AboutView },
        { path: "/content", component: ContentView },
      ],
    })
  )
  .use(createPinia())
  .mount("#app");
