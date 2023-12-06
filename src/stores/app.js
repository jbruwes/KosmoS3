import { get, set, useFetch, watchDebounced, whenever } from "@vueuse/core";
import { logicAnd } from "@vueuse/math";
import { defineStore, storeToRefs } from "pinia";
import { toXML } from "to-xml";
import { computed, reactive, watch } from "vue";

import storeData from "./data";
import storeS3 from "./s3";

export default defineStore("app", () => {
  const store = storeS3();
  const { S3, base, bucket } = storeToRefs(store);
  const { putObject, headObject } = store;
  const dataStore = storeData();
  const {
    path: path1,
    index,
    settings,
    script,
    js,
    style,
    css,
    content,
    list,
  } = storeToRefs(dataStore);
  const { calcIndex } = dataStore;
  /**
   * Переключатель видимости правой панели
   *
   * @type {boolean}
   */
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
    set(path1, val);
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

  const state = reactive({
    rightDrawer: null,
    js: {
      selected: undefined,
      tab: "script",
    },
    css: {
      selected: undefined,
      tab: "style",
    },
    content: {
      selected: undefined,
      tab: "wysiwyg",
      expanded: [],
    },
  });

  const sitemap = computed(() => ({
    "?": 'xml version="1.0" encoding="UTF-8"',
    urlset: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      url: get(list).map(({ loc, lastmod, changefreq, priority, path }) => ({
        loc: `https://${get(bucket)}/${loc ? encodeURI(loc) : path}`,
        lastmod,
        changefreq,
        priority,
      })),
    },
  }));
  watchDebounced(
    sitemap,
    (value, oldValue) => {
      if (value && oldValue)
        putObject("sitemap.xml", "application/xml", toXML(value));
    },
    { debounce: 1000, maxWait: 10000 },
  );
  return {
    index,
    settings,
    state,
    ...{
      script,
      js,
      style,
      css,
      content,
      list,
    },
  };
});
