<script>
import { nextTick } from "vue";
import { mapState, mapActions, mapWritableState } from "pinia";
import VRuntimeTemplate from "vue3-runtime-template";
import { jarallax, jarallaxVideo } from "jarallax";
import page from "page";
import GLightbox from "glightbox";
import DOMPurify from "dompurify";
import deck from "./modules/deck";
import carousel from "./modules/carousel";
import cardgrid from "./modules/cardgrid";
import list from "./modules/list";
import breadcrumbs from "./modules/breadcrumbs";
import icongrid from "./modules/icongrid";
import header from "./modules/header";
import pageheader from "./modules/pageheader";
import doubleheader from "./modules/doubleheader";
import pagination from "./modules/pagination";
import parentbutton from "./modules/parentbutton";

import core from "./stores/core.js";

import VCardK3 from "./modules/VCardK3.vue";
import VItemK3 from "./modules/VItemK3.vue";
import VCardSingleK3 from "./modules/VCardSingleK3.vue";
import VIconSingleK3 from "./modules/VIconSingleK3.vue";
import VCardSlideK3 from "./modules/VCardSlideK3.vue";
import VCardGridK3 from "./modules/VCardGridK3.vue";
import VMenuK3 from "./modules/VMenuK3.vue";
import VNavigationDrawerK3 from "./modules/VNavigationDrawerK3.vue";

export default {
  name: "App",
  /**
   * Инициализация данных приложения
   *
   * @returns {Data} Объект data
   */
  data: () => ({
    drawer: false,
    content: "",
  }),
  computed: {
    ...mapWritableState(core, ["context"]),
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
      "title",
      "treeTitle",
      "parentTitle",
      "description",
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
    /**
     * При изменении текущего объекта загружаем страницу
     */
    async item() {
      let html = "";
      if (this.context && this.context.page && this.context.page.len)
        try {
          const response = await fetch(
            `${encodeURIComponent(this.item.id)}.htm`,
            {
              cache: "no-store",
            }
          );
          html =
            response.status === 200
              ? DOMPurify.sanitize(await response.text(), {
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
                })
              : "";
        } finally {
          document.title = (
            this.item.title ? this.item.title : this.item.value
          ).replace(/"/g, "&quot;");
          const lUrl = this.item.href || this.item.path;
          [
            ['meta[name="description"]', this.item.description],
            ['meta[name="keywords"]', this.item.keywords],
            ['meta[property="og:title"]', document.title],
            ['meta[property="og:description"]', this.item.description],
            [
              'meta[property="og:url"]',
              `${window.location.origin}${
                lUrl === "/" ? "" : `${encodeURI(lUrl)}`
              }`,
            ],
            [
              'meta[property="og:image"]',
              this.item.image
                ? `${window.location.origin}/${this.item.image}`
                : "",
            ],
          ].forEach((e) => {
            const element = document.head.querySelector(e[0]);
            element.content = e[1] ? e[1].replace(/"/g, "&quot;") : "";
          });
          if (this.content === html) this.content = "";
          this.content = html;
          nextTick(() => {
            this.GLightbox();
            this.onhashchange();
            window.scrollTo(0, 0);
          });
        }
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
        .map((script) => this.$loadScript(script.url))
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
    /**
     * Обработчик загруженного контента
     *
     * @param {string} pSel Селектор
     */
    onhashchange(pSel = "#content") {
      if (this.tree) {
        carousel(this.tree, pSel);
        deck(this.tree, pSel);
        cardgrid(this.tree, pSel);
        list(this.tree, pSel);
        header(this.tree, pSel);
        pageheader(this.tree, pSel);
        doubleheader(this.tree, pSel);
        icongrid(this.tree, pSel);
        breadcrumbs(this.tree, pSel);
        pagination(this.tree, pSel);
        parentbutton(this.tree, pSel);
      }
      jarallax(document.querySelectorAll(".jarallax"));
      if (typeof init === "function") init.call(this.tree);
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
    VCardK3,
    VItemK3,
    VCardSingleK3,
    VIconSingleK3,
    VCardSlideK3,
    VCardGridK3,
    VMenuK3,
    VNavigationDrawerK3,
    VRuntimeTemplate,
  },
};
</script>
