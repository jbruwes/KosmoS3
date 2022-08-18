<script>
import { nextTick, computed } from "vue";
import { useScriptTag, useTitle, useFetch, get } from "@vueuse/core";
import {
  useStore,
  storeToRefs,
  mapState,
  mapActions,
  mapWritableState,
} from "pinia";
import VRuntimeTemplate from "vue3-runtime-template";
import { jarallax, jarallaxVideo } from "jarallax";
import page from "page";
import GLightbox from "glightbox";
import DOMPurify from "dompurify";
import carousel from "./modules/carousel";
import list from "./modules/list";
import breadcrumbs from "./modules/breadcrumbs";
import header from "./modules/header";
import pageheader from "./modules/pageheader";
import doubleheader from "./modules/doubleheader";
import pagination from "./modules/pagination";
import parentbutton from "./modules/parentbutton";

import core from "./stores/core.js";

import VCardTemplateK3 from "./modules/VCardTemplateK3.vue";

import VItemK3 from "./modules/VItemK3.vue";
import VCardK3 from "./modules/VCardK3.vue";
import VCardSlideK3 from "./modules/VCardSlideK3.vue";
import VCardGridK3 from "./modules/VCardGridK3.vue";
import VIconK3 from "./modules/VIconK3.vue";
import VIconSlideK3 from "./modules/VIconSlideK3.vue";
import VIconGridK3 from "./modules/VIconGridK3.vue";
import VMenuK3 from "./modules/VMenuK3.vue";
import VNavigationDrawerK3 from "./modules/VNavigationDrawerK3.vue";

export default {
  name: "App",
  /**
   * Инициализация данных приложения
   *
   * @returns {Data} Объект data
   */
  setup() {
    const store = core();
    const { title, id, context } = storeToRefs(store);
    useTitle(title);
    const { data, statusCode } = useFetch(
      computed(() => `${encodeURIComponent(get(id))}.htm`),
      {
        beforeFetch({ cancel }) {
          if (!(get(context).page && get(context).page.len)) cancel();
        },
        afterFetch(ctx) {
          ctx.data = DOMPurify.sanitize(ctx.data, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: [
              "target",
              "allow",
              "allowfullscreen",
              "frameborder",
              "scrolling",
            ],
            CUSTOM_ELEMENT_HANDLING: {
              tagNameCheck: /^v-/,
              attributeNameCheck: /\w+/,
              allowCustomizedBuiltInElements: true,
            },
          });
          return ctx;
        },
        refetch: true,
      }
    );
    return { title, id, context, data, statusCode };
  },
  data: () => ({ drawer: false, template: String }),
  computed: {
    ...mapState(core, [
      "tree",
      "list",
      "siblings",
      "children",
      "treeChildren",
      "parentChildren",
      "vector",
      "parent",
      "item",
      "description",
      "treeTitle",
      "parentTitle",
      "treeDescription",
      "parentDescription",
      "icon",
      "treeIcon",
      "parentIcon",
      "path",
      "treePath",
      "parentPath",
      "image",
      "treeImage",
      "parentImage",
      "routePath",
    ]),
  },
  watch: {
    data: {
      handler: function (newData) {
        this.template =
          !this.statusCode || this.statusCode === 200 ? newData : "<div></div>";
      },
      immediate: true,
    },
    template() {
      nextTick(() => {
        this.GLightbox();
        this.onhashchange();
        window.scrollTo(0, 0);
      });
    },
    title(newTitle) {
      this.meta(['meta[property="og:title"]', newTitle]);
    },
    path(newPath) {
      this.meta([
        'meta[property="og:url"]',
        `${window.location.origin}${
          newPath === "/" ? "" : `${encodeURI(newPath)}`
        }`,
      ]);
    },
    description(newDescription) {
      [
        ['meta[name="description"]', newDescription],
        ['meta[property="og:description"]', newDescription],
      ].forEach(this.meta);
    },
    keywords(newKeywords) {
      this.meta(['meta[name="keywords"]', newKeywords]);
    },
    image(newImage) {
      this.meta([
        'meta[property="og:image"]',
        newImage ? `${window.location.origin}/${newImage}` : "",
      ]);
    },
    /**
     * При изменении индекса создаем роутер
     */
    tree() {
      if (!window.frameElement) {
        page.stop();
        this.list.forEach((node) => {
          if (node.href) page(node.href, this.route);
          page(node.path, this.route);
        });
        page.start();
      }
    },
  },
  /**
   * Обработчик монтирования приложения
   */
  async mounted() {
    jarallaxVideo();
    this.GLightbox();
    await Promise.allSettled(
      [
        ...(
          await Promise.all([
            (await fetch("index.cdn.json", { cache: "no-store" })).json(),
            await this.initIndex(),
          ])
        )[0],
        { url: "index.js" },
      ]
        .filter((script) => script.url)
        .map((script) =>
          useScriptTag(script.url, undefined, { manual: true }).load()
        )
    );
    this.onhashchange("#kosmos3");
  },
  methods: {
    ...mapActions(core, [
      "initIndex",
      "getPath",
      "getTitle",
      "getVector",
      "getParent",
      "getSiblings",
    ]),
    /**
     * Обработка роутинга
     *
     * @param {Context} context Объект роутинга
     */
    route(context) {
      this.context = context;
    },
    meta(e) {
      const element = document.head.querySelector(e[0]);
      element.content = e[1] ? e[1].replace(/"/g, "&quot;") : "";
    },
    /**
     * Обработчик загруженного контента
     *
     * @param {string} pSel Селектор
     */
    onhashchange(pSel = "#content") {
      if (this.tree) {
        //const tree = structuredClone(this.tree);
        const tree = { ...this.tree };
        carousel(tree, pSel);
        list(tree, pSel);
        header(tree, pSel);
        pageheader(tree, pSel);
        doubleheader(tree, pSel);
        breadcrumbs(tree, pSel);
        pagination(tree, pSel);
        parentbutton(tree, pSel);
        if (typeof init === "function") init.call(tree);
      }
      jarallax(document.querySelectorAll(".jarallax"));
    },
    /**
     * Натравливаем GLightbox на всё подряд
     */
    GLightbox() {
      document
        .querySelectorAll(
          'a[href$=".jpeg"],' +
            'a[href$=".jpg"],' +
            'a[href$=".jpe"],' +
            'a[href$=".jfi"],' +
            'a[href$=".jif"],' +
            'a[href$=".jfif"],' +
            'a[href$=".png"],' +
            'a[href$=".gif"],' +
            'a[href$=".bmp"],' +
            'a[href$=".webp"],' +
            'a[href$=".webm"],' +
            'a[href$=".ogv"],' +
            'a[href$=".mp4"],' +
            'a[href^="https://www.youtube.com/embed/"],' +
            'a[href^="https://www.youtube.com/watch?v="],' +
            'a[href^="https://www.youtu.be/embed/"],' +
            'a[href^="https://www.youtu.be/watch?v="],' +
            'a[href^="https://www.youtube-nocookie.com/embed/"],' +
            'a[href^="https://www.youtube-nocookie.com/watch?v="],' +
            'a[href^="https://vimeo.com/"]'
        )
        .forEach((e) => {
          e.setAttribute("rel", "external");
          e.classList.add("glightbox");
        });
      GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        zoomable: false,
      });
    },
  },
  components: {
    VCardTemplateK3,
    VItemK3,
    VCardK3,
    VCardSlideK3,
    VCardGridK3,
    VIconK3,
    VIconSlideK3,
    VIconGridK3,
    VMenuK3,
    VNavigationDrawerK3,
    VRuntimeTemplate,
  },
};
</script>
