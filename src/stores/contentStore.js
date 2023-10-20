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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const list = computed(() =>
    (function getMembers(members, pParent) {
      return members.reduce((accumulator, current) => {
        if (!("parent" in current))
          Object.defineProperty(current, "parent", {
            /**
             * @returns {object} - родительский объект
             */
            get() {
              return pParent;
            },
          });
        if (!("siblings" in current))
          Object.defineProperty(current, "siblings", {
            /**
             * @returns {Array} - массив одноуровневых объектов
             */
            get() {
              return this.parent ? this.parent?.children : [this];
            },
          });
        if (!("index" in current))
          Object.defineProperty(current, "index", {
            /**
             * @returns {number} - позиция в массиве одноуровневых объектов
             */
            get() {
              return this.siblings.findIndex(({ id }) => this.id === id);
            },
          });
        if (!("prev" in current))
          Object.defineProperty(current, "prev", {
            /**
             * @returns {Array} - массив одноуровневых объектов
             */
            get() {
              return this.siblings[this.index - 1];
            },
          });
        if (!("next" in current))
          Object.defineProperty(current, "next", {
            /**
             * @returns {Array} - массив одноуровневых объектов
             */
            get() {
              return this.siblings[this.index + 1];
            },
          });
        if (!("branch" in current))
          Object.defineProperty(current, "branch", {
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
