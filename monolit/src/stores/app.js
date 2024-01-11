import { useStyleTag } from "@vueuse/core";
import { defineStore } from "pinia";
import * as Vue from "vue";
import { loadModule } from "vue3-sfc-loader";

export default defineStore("app", () => {
  const { defineAsyncComponent } = Vue;
  /**
   * @param {object} the - Текущий объект
   * @returns {object} - Шаблон
   */
  const getTemplate = (the) =>
    defineAsyncComponent(() =>
      loadModule(`/${the.id}.vue`, {
        moduleCache: {
          vue: Vue,
        },
        /** @returns {string} - Шаблон */
        getFile: () => `<script setup>const props=defineProps(["the","mdi"]);
          ${the.script ?? ""}</script><template>${
            the.template ?? ""
          }</template><style scoped>${the.style ?? ""}</style>`,
        /** @param {string} value - Стили */
        addStyle(value) {
          if (value) useStyleTag(value, { id: `vueuse_styletag_${the.id}` });
        },
      }),
    );

  return { getTemplate };
});
