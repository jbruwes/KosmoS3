import * as tresjsCientos from "@tresjs/cientos";
import * as tresjsCore from "@tresjs/core";
import * as vueuseCore from "@vueuse/core";
import * as vueuseMath from "@vueuse/math";
import { defineStore } from "pinia";
import * as Vue from "vue";
import * as vueRouter from "vue-router";
import { loadModule } from "vue3-sfc-loader";

export default defineStore("app", () => {
  const { useStyleTag } = vueuseCore;
  /**
   * @param {object} the - Текущий объект
   * @returns {object} - Шаблон
   */
  const getTemplate = (the) =>
    loadModule(`/${the.id}.vue`, {
      moduleCache: {
        vue: Vue,
        "vue-router": vueRouter,
        "@vueuse/core": vueuseCore,
        "@vueuse/math": vueuseMath,
        "@tresjs/core": tresjsCore,
        "@tresjs/cientos": tresjsCientos,
      },
      /** @returns {string} - Шаблон */
      getFile: () =>
        `<script setup>const props=defineProps(["the","mdi"]);${the.script ?? ""}</script><template>${the.template ?? ""}</template><style scoped>${the.style ?? ""}</style>`,
      /** @param {string} value - Стили */
      addStyle(value) {
        useStyleTag(value, { id: `style_${the.id}` });
      },
      /**
       * @param {string} type - Тип записи
       * @param {...any} args - Содержимое записи
       */
      log(type, ...args) {
        // eslint-disable-next-line no-console
        console[type](...args);
      },
    });
  return { getTemplate };
});
