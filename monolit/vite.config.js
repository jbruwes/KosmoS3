import { fileURLToPath, URL } from "node:url";

import { templateCompilerOptions } from "@tresjs/core";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
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
          id.includes("node_modules")
            ? id.split("node_modules/")[1].split("/")[0]
            : "",
      },
    },
  },
});
