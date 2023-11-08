import { get, isDefined } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";

import app from "./app";

export default defineStore("cssStore", () => {
  const store = app();
  const { index } = storeToRefs(store);
  const selected = ref();
  const css = computed({
    /**
     * Чтение массива ссылок на стили
     *
     * @returns {Array} Массив ссылок на стили
     */
    get: () => get(index)?.css,
    /**
     * Запись массива ссылок на стили
     *
     * @param {Array} value Массив ссылок на стили
     */
    set(value) {
      if (isDefined(index)) get(index).css = value.filter(({ url }) => url);
    },
  });
  const list = computed(() =>
    get(css).map((current) => {
      Object.defineProperties(current, {
        siblings: {
          /** @returns {Array} - Массив одноуровневых объектов */
          get() {
            return get(css);
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
  return { css, selected, list };
});
