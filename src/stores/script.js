import { get, isDefined, useArrayFind } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";

import app from "./app";

export default defineStore("scriptStore", () => {
  const store = app();
  const { index } = storeToRefs(store);
  const selected = ref();
  const tab = ref("script");
  const script = computed({
    /**
     * Чтение скрипта
     *
     * @returns {string} Скрипт
     */
    get: () => get(index)?.script,
    /**
     * Запись скрипта
     *
     * @param {string} value Скрипт
     */
    set(value) {
      if (isDefined(index)) get(index).script = value;
    },
  });
  const js = computed({
    /**
     * Чтение массива ссылок на скрипты
     *
     * @returns {Array} Массив ссылок на скрипты
     */
    get: () => get(index)?.js,
    /**
     * Запись массива ссылок на скрипты
     *
     * @param {Array} value Массив ссылок на скрипты
     */
    set(value) {
      if (isDefined(index)) get(index).js = value.filter(({ url }) => url);
    },
  });
  const list = computed(() =>
    get(js).map((current) => {
      Object.defineProperties(current, {
        siblings: {
          /** @returns {Array} - Массив одноуровневых объектов */
          get() {
            return get(js);
          },
          configurable: true,
        },
        index: {
          /** @returns {number} - Позиция в массиве одноуровневых объектов */
          get() {
            return this.siblings.findIndex(({ id }) => this.id === id);
          },
          configurable: true,
        },
        prev: {
          /** @returns {Array} - Массив одноуровневых объектов */
          get() {
            return this.siblings[this.index - 1];
          },
          configurable: true,
        },
        next: {
          /** @returns {Array} - Массив одноуровневых объектов */
          get() {
            return this.siblings[this.index + 1];
          },
          configurable: true,
        },
      });
      return current;
    }),
  );
  const selectedObject = useArrayFind(list, ({ id }) => id === get(selected));
  return { js, script, selected, list, selectedObject, tab };
});
