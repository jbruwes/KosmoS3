import { get, isDefined, useArrayFind } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";

import app from "./app";

export default defineStore("templateStore", () => {
  const store = app();
  const { index } = storeToRefs(store);
  const selected = ref();
  const expanded = ref([]);
  const content = computed({
    /**
     * чтение контента
     * @returns {object} контент
     */
    get: () => get(index)?.content,
    /**
     * запись контента
     * @param {object} value контент
     */
    set(value) {
      if (isDefined(index)) get(index).content = value;
    },
  });

  const list = computed(() =>
    (function getMembers(members, pParent) {
      return members.reduce((accumulator, current) => {
        Object.defineProperties(current, {
          parent: {
            /**
             * @returns {object} - родительский объект
             */
            get() {
              return pParent;
            },
            configurable: true,
          },
          siblings: {
            /**
             * @returns {Array} - массив одноуровневых объектов
             */
            get() {
              return this.parent ? this.parent?.children : [this];
            },
            configurable: true,
          },
          index: {
            /**
             * @returns {number} - позиция в массиве однокровневых объектов
             */
            get() {
              return this.siblings.findIndex(({ id }) => this.id === id);
            },
            configurable: true,
          },
          prev: {
            /**
             * @returns {Array} - массив одноуровневых объектов
             */
            get() {
              return this.siblings[this.index - 1];
            },
            configurable: true,
          },
          next: {
            /**
             * @returns {Array} - массив одноуровневых объектов
             */
            get() {
              return this.siblings[this.index + 1];
            },
            configurable: true,
          },
          branch: {
            /**
             * @returns {Array} - массив родительских объектов
             */
            get() {
              const branch = [this];
              let { parent } = this;
              while (parent) {
                branch.unshift(parent);
                ({ parent } = parent);
              }
              return branch;
            },
            configurable: true,
          },
        });
        return current.children?.length
          ? [...accumulator, ...getMembers(current.children, current)]
          : accumulator;
      }, members);
    })(get(content) ?? []),
  );
  /**
   * переключатель видимости правой панели
   * @type {boolean}
   */
  const rightDrawer = ref(null);
  const selectedObject = useArrayFind(list, ({ id }) => id === get(selected));
  return { rightDrawer, content, selected, expanded, list, selectedObject };
});
