import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import VueKonva from "vue-konva";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import HomeView from "./views/HomeView.vue";
import AboutView from "./views/AboutView.vue";
import ContentView from "./views/ContentView.vue";
import TemplateView from "./views/TemplateView.vue";
import CssView from "./views/CssView.vue";
import JsView from "./views/JsView.vue";
import SettingsView from "./views/SettingsView.vue";

createApp(App)
  .use(vuetify)
  .use(
    createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: HomeView },
        { path: "/about", component: AboutView },
        { path: "/content", component: ContentView },
        { path: "/template", component: TemplateView },
        { path: "/css", component: CssView },
        { path: "/js", component: JsView },
        { path: "/settings", component: SettingsView },
      ],
    })
  )
  .use(VueKonva)
  .use(createPinia())
  .mount("#app");
