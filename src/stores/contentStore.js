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
  /**
   *
   * @param {object} current - объект
   */
  const setSiblings = (current) => {
    if (!("siblings" in current))
      Object.defineProperty(current, "siblings", {
        /**
         * @returns {Array} - массив одноуровневых объектов
         */
        get() {
          return this.parent ? this.parent?.children : [this];
        },
      });
  };
  /**
   *
   * @param {object} current - объект
   */
  const setIndex = (current) => {
    if (!("index" in current))
      Object.defineProperty(current, "index", {
        /**
         * @returns {number} - позиция в массиве одноуровневых объектов
         */
        get() {
          return this.siblings.findIndex(({ id }) => this.id === id);
        },
      });
  };
  /**
   *
   * @param {object} current - объект
   */
  const setPrev = (current) => {
    if (!("prev" in current))
      Object.defineProperty(current, "prev", {
        /**
         * @returns {Array} - массив одноуровневых объектов
         */
        get() {
          return this.siblings[this.index - 1];
        },
      });
  };
  /**
   *
   * @param {object} current - объект
   */
  const setNext = (current) => {
    if (!("next" in current))
      Object.defineProperty(current, "next", {
        /**
         * @returns {Array} - массив одноуровневых объектов
         */
        get() {
          return this.siblings[this.index + 1];
        },
      });
  };
  /**
   *
   * @param {object} current - объект
   */
  const setBranch = (current) => {
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
  };
  /**
   *
   * @param {Array} members - мвссив объектов
   * @param {object} [pParent] - родительский объект
   * @returns {Array} - плоский массив объектов
   */
  const getMembers = (members, pParent) =>
    members.reduce((accumulator, current) => {
      if (!("parent" in current))
        Object.defineProperty(current, "parent", {
          /**
           * @returns {object} - родительский объект
           */
          get() {
            return pParent;
          },
        });
      setSiblings(current);
      setIndex(current);
      setPrev(current);
      setNext(current);
      setBranch(current);
      return current.children?.length
        ? [...accumulator, ...getMembers(current.children, current)]
        : accumulator;
    }, members);

  const list = computed(() => getMembers(get(content) ?? []));
  /**
   * переключатель видимости правой панели
   * @type {boolean}
   */
  const rightDrawer = ref(null);
  const selectedObject = useArrayFind(list, ({ id }) => id === get(selected));
  return { rightDrawer, content, selected, expanded, list, selectedObject };
});
