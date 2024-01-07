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
import { toXML } from "to-xml";
import { computed, reactive, watch } from "vue";

import storeData from "~/monolit/src/stores/data";

import storeS3 from "./s3";

export default defineStore("app", () => {
  const store = storeS3();
  const { S3, base, bucket } = storeToRefs(store);
  const { putObject, headObject } = store;
  const dataStore = storeData();
  const { uri, tree, settings, script, js, style, css, content, flatTree } =
    storeToRefs(dataStore);
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
    set(uri, val);
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
    get(data).reduce(async (promise, asset, currentIndex) => {
      if (currentIndex % 2) await promise;
      await headPutObject(asset);
    }, Promise.resolve());
  });
  watchDebounced(
    tree,
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
  const selectedObject = useArrayFind(
    flatTree,
    ({ id }) => id === state.content.selected,
  );
  const selectedValue = computed({
    /**
     * Считывание исходного кода из структуры данных
     *
     * @returns {string} - Template
     */
    get() {
      const { template = "" } = get(selectedObject) ?? {};
      return template.replace(/src="([^"]+)"/gi, (match, p1) => {
        const { href } = new URL(p1, get(base));
        return `src="${href}"`;
      });
    },
    /**
     * Запись исходного кода страницы в структуры данных
     *
     * @param {string} value - Template
     */
    set(value) {
      const regexp = new RegExp(`^${get(base)}`);
      get(selectedObject).template = value.replace(
        /src="([^"]+)"/gi,
        (match, p1) => `src="${p1.replace(regexp, "")}"`,
      );
      get(selectedObject).lastmod = new Date().toISOString();
    },
  });
  const sitemap = computed(() => ({
    "?": 'xml version="1.0" encoding="UTF-8"',
    urlset: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      url: get(flatTree).map(
        ({ loc, lastmod, changefreq, priority, path }) => ({
          loc: `https://${get(bucket)}/${loc ? encodeURI(loc) : path}`,
          lastmod,
          changefreq,
          priority,
        }),
      ),
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
  const themes = reactive([
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ]);
  return {
    settings,
    themes,
    state,
    ...{
      script,
      js,
      style,
      css,
      content,
      flatTree,
      selectedValue,
      selectedObject,
    },
  };
});
