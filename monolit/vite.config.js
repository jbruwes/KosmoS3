import { fileURLToPath, URL } from "node:url";

import { templateCompilerOptions } from "@tresjs/core";
import extractorPug from "@unocss/extractor-pug";
import UnoCSS from "@unocss/vite";
// import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";

import unocssConfig from "../uno.config";

const extractors = [extractorPug()];

// const modernPolyfills = ["es.promise.with-resolvers"];

const plugins = [
  vue({ ...templateCompilerOptions }),
  UnoCSS({ ...unocssConfig, extractors }),
  // legacy({ modernPolyfills }),
];

const alias = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  "~": fileURLToPath(new URL("..", import.meta.url)),
};

const extensions = [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"];

const resolve = { alias, extensions };

const manifest = true;

const outDir = "../public/monolit";

/**
 * Разборка по вендорам
 *
 * @param {string} id - Путь до модуля
 * @returns {string} - Вендор
 */
const manualChunks = (id = "") =>
  id?.split("node_modules/")?.[1]?.split("/")?.[0] ?? "";

const output = { manualChunks };

const rollupOptions = { output };

const build = { manifest, outDir, rollupOptions };

const define = {
  __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
};

export default { plugins, resolve, build, define };
