import "tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/plugins/preview";
import "tinymce/plugins/importcss";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/save";
import "tinymce/plugins/directionality";
import "tinymce/plugins/code";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/media";
import "tinymce/plugins/template";
import "tinymce/plugins/codesample";
import "tinymce/plugins/table";
import "tinymce/plugins/charmap";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/anchor";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/advlist";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";
import "tinymce/skins/ui/oxide/skin.css";
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
