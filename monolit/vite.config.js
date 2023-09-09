// Plugins
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
// Utilities
import { defineConfig } from "vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      vue: "vue/dist/vue.esm-bundler.js",
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  build: {
    manifest: true,
    outDir: "../public/monolit",
    rollupOptions: {
      output: {
        /**
         * Разборка по вендорам
         * @param {string} id - путь до модуля
         * @returns {string} - вендор
         */
        manualChunks: (id) =>
          id.includes("node_modules")
            ? id.split("node_modules/")[1].split("/")[0]
            : "",
      },
    },
  },
});
