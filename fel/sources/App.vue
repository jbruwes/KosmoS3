<script>
import { nextTick, computed } from "vue";
import { useScriptTag, useBrowserLocation, set } from "@vueuse/core";
import { useHead } from "@vueuse/head";
import { storeToRefs, mapState, mapActions, mapWritableState } from "pinia";
import VRuntimeTemplate from "vue3-runtime-template";
import page from "page";
import GLightbox from "glightbox";
import DOMPurify from "dompurify";

import core from "~/core.js";

import VSingleHeaderK3 from "./modules/VSingleHeaderK3.vue";
import VSingleButtonK3 from "./modules/VSingleButtonK3.vue";
import VParentButtonK3 from "./modules/VParentButtonK3.vue";
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
import VPaginationK3 from "./modules/VPaginationK3.vue";
import VBreadcrumbsK3 from "./modules/VBreadcrumbsK3.vue";
import VNavigationDrawerK3 from "./modules/VNavigationDrawerK3.vue";

export default {
  name: "App",
  /**
   * Инициализация данных приложения
   *
   * @returns {Object} Объект data
   */
  setup() {
    const store = core();
    const { title, path, description, keywords, image } = storeToRefs(store);
    const location = useBrowserLocation();
    useHead({
      title,
      meta: [
        { property: "og:title", content: title },
        {
          property: "og:url",
          content: computed(
            () =>
              `${location.origin}${path === "/" ? "" : `${encodeURI(path)}`}`
          ),
        },
        { name: "description", content: description },
        { property: "og:description", content: description },
        { name: "keywords", content: keywords },
        {
          property: "og:image",
          content: image ? `${location.origin}/${image}` : "",
        },
      ],
    });
    return { title, path, description, keywords, image };
  },

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
      "treeTitle",
      "parentTitle",
      "treeDescription",
      "parentDescription",
      "icon",
      "treeIcon",
      "parentIcon",
      "treePath",
      "parentPath",
      "treeImage",
      "parentImage",
    ]),
    ...mapWritableState(core, ["template", "routePath", "pageLen"]),
  },
  watch: {
    async template() {
      await nextTick();
      this.GLightbox();
      if (typeof init === "function") init.call({ ...this.tree });
      window.scrollTo(0, 0);
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
    async route(context) {
      await nextTick();
      if (this.routePath !== context.routePath) {
        this.pageLen = context.page.len;
        this.routePath = context.routePath;
      }
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
    VParentButtonK3,
    VSingleHeaderK3,
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
    VPaginationK3,
    VBreadcrumbsK3,
    VNavigationDrawerK3,
    VRuntimeTemplate,
  },
};
</script>
