/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import { createApp } from "vue";
import registerPlugins from "@/plugins";
import App from "./App.vue";

// Composables

// Plugins

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
