import {
  get,
  set,
  useArrayFind,
  useFetch,
  watchDebounced,
  whenever,
} from "@vueuse/core";
import { logicAnd } from "@vueuse/math";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

import storeData from "./data";
import storeS3 from "./s3";

export default defineStore("app", () => {
  const store = storeS3();
  const { S3, base } = storeToRefs(store);
  const { putObject, headObject } = store;
  const dataStore = storeData();
  const { path, index, settings, script, js } = storeToRefs(dataStore);
  const { calcIndex } = dataStore;
  /**
   * Переключатель видимости правой панели
   *
   * @type {boolean}
   */
  const rightDrawer = ref(null);
  const { data } = useFetch("monolit/.vite/manifest.json", {
    /**
     * Преводим в массив
     *
     * @param {object} ctx - Возвращаемый объект
     * @returns {object} - Трансформируемый возвращаемый объект
     */
    afterFetch(ctx) {
      ctx.data = [
        "index.html",
        ...Object.values(ctx.data).map(({ file }) => file),
      ];
      return ctx;
    },
  }).json();
  watch(base, (val) => {
    set(path, val);
  });
  whenever(logicAnd(S3, data), () => {
    /** @param {string} pAsset - Путь до файла ресурса */
    const headPutObject = async (pAsset) => {
      try {
        if (pAsset === "index.html") throw new Error();
        await headObject(pAsset);
      } catch (e) {
        const { data: body } = await useFetch(`monolit/${pAsset}`).blob();
        putObject(pAsset, get(body).type, get(body));
      }
    };
    get(data).reduce(async (promise, asset) => {
      await promise;
      await headPutObject(asset);
    }, Promise.resolve());
  });
  watchDebounced(
    index,
    (value, oldValue) => {
      if (value && oldValue)
        putObject(
          "data.json",
          "application/json",
          JSON.stringify(calcIndex(value)),
        );
    },
    { deep: true, debounce: 1000, maxWait: 10000 },
  );

  const jsSelected = ref();
  const jsTab = ref("script");
  const jsList = computed(() =>
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
  const jsSelectedObject = useArrayFind(
    jsList,
    ({ id }) => id === get(jsSelected),
  );
  return {
    index,
    settings,
    rightDrawer,
    ...{
      script,
      js,
      jsSelected,
      jsTab,
      jsList,
      jsSelectedObject,
    },
  };
});
