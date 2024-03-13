import { fileURLToPath, URL } from "node:url";

import { templateCompilerOptions } from "@tresjs/core";
import extractorPug from "@unocss/extractor-pug";
// import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
// eslint-disable-next-line import/no-unresolved
import UnoCSS from "unocss/vite";

import unocssConfig from "../uno.config";

// https://vitejs.dev/config/
export default {
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
    UnoCSS({ ...unocssConfig, extractors: [extractorPug()] }),
    // legacy({
    //   modernPolyfills: ["es.promise.with-resolvers"],
    // }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("..", import.meta.url)),
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
         *
         * @param {string} id - Путь до модуля
         * @returns {string} - Вендор
         */
        manualChunks: (id) =>
          id.split("node_modules/")?.[1]?.split("/")[0] ?? "",
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
};
