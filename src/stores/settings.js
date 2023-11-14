import { get, isDefined } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";

import app from "./app";

export default defineStore("settingsStore", () => {
  const store = app();
  const { index } = storeToRefs(store);
  const settings = computed({
    /**
     * Чтение настроек
     *
     * @returns {object} Настройки
     */
    get: () => get(index)?.settings,
    /**
     * Запись настроек
     *
     * @param {object} value Настройки
     */
    set(value) {
      if (isDefined(index)) get(index).settings = value;
    },
  });
  return { settings };
});
