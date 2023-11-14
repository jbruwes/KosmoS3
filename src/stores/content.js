import { get, isDefined, useArrayFind } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { toXML } from "to-xml";
import { computed, ref, watch } from "vue";

import app from "./app";

export default defineStore("contentStore", () => {
  const store = app();
  const { index } = storeToRefs(store);
  const selected = ref();
  const expanded = ref([]);
  const tab = ref("wysiwyg");
  const content = computed({
    /**
     * Чтение контента
     *
     * @returns {object} Контент
     */
    get: () => get(index)?.content,
    /**
     * Запись контента
     *
     * @param {object} value Контент
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
            /** @returns {object} - Родительский объект */
            get() {
              return pParent;
            },
            configurable: true,
          },
          siblings: {
            /** @returns {Array} - Массив одноуровневых объектов */
            get() {
              return this.parent ? this.parent?.children : [this];
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
          branch: {
            /** @returns {Array} - Массив родительских объектов */
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
    })(get(content) ?? [{}]),
  );
  const selectedObject = useArrayFind(list, ({ id }) => id === get(selected));

  const sitemap = computed(() => {
    return {
      "?": 'xml version="1.0" encoding="UTF-8"',
      urlset: {
        "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        url: get(list).map(({ loc, lastmod, changefreq, priority }) => ({
          loc,
          lastmod,
          changefreq,
          priority,
        })),
      },
    };
  });
  watch(
    sitemap,
    (val) => {
      console.log(JSON.stringify(val));
      console.log(toXML(val));
    },
    { deep: true },
  );
  return { content, selected, expanded, list, selectedObject, tab };
});
