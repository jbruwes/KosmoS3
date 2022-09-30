import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import HomeView from "./components/HomeView.vue";
import AboutView from "./components/AboutView.vue";
import ContentView from "./components/ContentView.vue";
import TemplateView from "./components/TemplateView.vue";
import CssView from "./components/CssView.vue";
import JsView from "./components/JsView.vue";
import SettingsView from "./components/SettingsView.vue";

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
  .use(createPinia())
  .mount("#app");
