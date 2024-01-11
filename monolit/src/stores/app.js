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
        getFile: () => {
          // eslint-disable-next-line no-useless-escape
          return `<script setup>defineProps(["the","mdi"])<\/script><template>${
            the.template ?? ""
          }</template>`;
        },
        /** AddStyle */
        addStyle() {
          /* unused here */
        },
      }),
    );

  return { getTemplate };
});
