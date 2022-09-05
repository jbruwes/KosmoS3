<script>
import { nextTick } from "vue";
import { useScriptTag, useTitle, set } from "@vueuse/core";
import {
  storeToRefs,
  mapState,
  mapActions,
  mapWritableState,
} from "pinia";
import VRuntimeTemplate from "vue3-runtime-template";
import page from "page";
import GLightbox from "glightbox";
import DOMPurify from "dompurify";

import core from "~/core.js";

import VSingleButtonK3 from "./modules/VSingleButtonK3.vue";
import VSingleItemK3 from "./modules/VSingleItemK3.vue";
import VListItemK3 from "./modules/VListItemK3.vue";
import VCarouselBannerK3 from "./modules/VCarouselBannerK3.vue";
import VSingleBannerK3 from "./modules/VSingleBannerK3.vue";
import VSingleCardK3 from "./modules/VSingleCardK3.vue";
import VSlideCardK3 from "./modules/VSlideCardK3.vue";
import VGridCardK3 from "./modules/VGridCardK3.vue";
import VSingleIconK3 from "./modules/VSingleIconK3.vue";
import VSlideIconK3 from "./modules/VSlideIconK3.vue";
import VGridIconK3 from "./modules/VGridIconK3.vue";
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
    const { title } = storeToRefs(store);
    useTitle(title);
    return { title };
  },

/*
setup() {
    const store = core();
    const { title, path, description, keywords, image } = storeToRefs(store);
    useHead({
      title,
      base: { href: "/" },
      meta: [
        { property: "og:title", content: title },
        {
          property: "og:url",
          content: computed(
            () =>
              `${window.location.origin}${
                path === "/" ? "" : `${encodeURI(path)}`
              }`
          ),
        },
        { name: "description", content: description },
        { property: "og:description", content: description },
        { name: "keywords", content: keywords },
        {
          property: "og:image",
          content: image ? `${window.location.origin}/${image}` : "",
        },
      ],
    });
  },
*/

  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapState(core, [
      "id",
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
    ]),
    ...mapWritableState(core, ["template", "routePath", "pageLen"]),
  },
  watch: {
    template() {
      nextTick(() => {
        this.GLightbox();
        if (typeof init === "function") init.call({ ...this.tree });
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
    await Promise.allSettled(
      [
        ...(
          await Promise.all([
            (await fetch("index.cdn.json", { cache: "no-store" })).json(),
          ])
        )[0],
        { url: "index.js" },
      ]
        .filter((script) => script.url)
        .map((script) =>
          useScriptTag(script.url, undefined, { manual: true }).load()
        )
    );
    this.template = "";
  },
  methods: {
    ...mapActions(core, [
      "getHref",
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
      nextTick(() => {
        this.pageLen = context.page.len;
        this.routePath = context.routePath;
      });
    },
    meta(e) {
      const element = document.head.querySelector(e[0]);
      element.content = e[1] ? e[1].replace(/"/g, "&quot;") : "";
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
    VSingleButtonK3,
    VListItemK3,
    VSingleItemK3,
    VCarouselBannerK3,
    VSingleBannerK3,
    VSingleCardK3,
    VSingleIconK3,
    VSlideCardK3,
    VSlideIconK3,
    VGridCardK3,
    VGridIconK3,
    VMenuK3,
    VNavigationDrawerK3,
    VRuntimeTemplate,
  },
};
</script>
