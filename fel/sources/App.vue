<script lang="ts">
import { defineComponent, nextTick } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";
import { jarallax, jarallaxVideo } from "jarallax";
import page from "page";
import type { Context } from "page";
import jsel from "jsel";
import AOS from "aos";
import GLightbox from "glightbox";
import DOMPurify from "dompurify";
import deck from "./modules/deck";
import carousel from "./modules/carousel";
import cardgrid from "./modules/cardgrid";
import card from "./modules/card";
import list from "./modules/list";
import breadcrumbs from "./modules/breadcrumbs";
import icongrid from "./modules/icongrid";
import header from "./modules/header";
import pageheader from "./modules/pageheader";
import doubleheader from "./modules/doubleheader";
import menu from "./modules/menu";
import sidebar from "./modules/sidebar";
import pagination from "./modules/pagination";
import parentbutton from "./modules/parentbutton";

export default defineComponent({
  name: "App",
  /**
   * Инициализация данных приложения
   *
   * @returns {Data} Объект data
   */
  data: (): Data => ({
    index: undefined,
    urls: undefined,
    content: undefined,
    context: undefined,
  }),
  computed: {
    /**
     * Пользовательские скрипты
     *
     * @returns {Promise<HTMLScriptElement>[]} Массив обещаний по зпгрузке пользовательских скриптов
     */
    scripts(): Promise<HTMLScriptElement>[] | undefined {
      return this.urls
        ? [...this.urls, { url: "index.js" }]
            .filter((script) => script.url)
            .map((script) => this.$loadScript(script.url))
        : undefined;
    },
    /**
     * Текущий объект
     *
     * @returns {Branch} Текущий объект для загрузки
     */
    node(): Branch | undefined {
      return this.plainIndex.find((e: Branch) =>
        this.context
          ? e.path === this.context.routePath ||
            e.url === this.context.routePath
          : undefined
      );
    },
    /**
     * Плоский индекс
     *
     * @returns {Branch[]} Плоский индекс для поиска
     */
    plainIndex(): Branch[] {
      const plainIndex = jsel(this.index).selectAll("//*[@id]");
      plainIndex.forEach((node: Branch) => {
        const lNode = node;
        let path = jsel(this.index).selectAll(
          `//*[@id="${lNode.id}"]/ancestor-or-self::*[@id]`
        );
        path = path.map((e: Branch) => e.value.trim().replace(/\s/g, "_"));
        path.shift();
        lNode.path = `/${path.join("/")}`;
        lNode.url = lNode.url
          ? `/${lNode.url.trim().replace(/^\/+|\/+$/g, "")}`
          : "";
      });
      return plainIndex;
    },
  },
  watch: {
    /**
     * При изменении текущего объекта загружаем страницу
     */
    async node() {
      let html = "";
      if (this.node)
        try {
          const response = await fetch(
            `${encodeURIComponent(this.node.id)}.htm`,
            {
              cache: "no-store",
            }
          );
          html =
            response.status === 200
              ? DOMPurify.sanitize(await response.text(), {
                  ADD_TAGS: ["iframe"],
                  ADD_ATTR: [
                    "allow",
                    "allowfullscreen",
                    "frameborder",
                    "scrolling",
                  ],
                })
              : "";
        } finally {
          document.title = (
            this.node.title ? this.node.title : this.node.value
          ).replace(/"/g, "&quot;");
          const lUrl = this.node.url || this.node.path;
          [
            ['meta[name="description"]', this.node.description],
            ['meta[name="keywords"]', this.node.keywords],
            ['meta[property="og:title"]', document.title],
            ['meta[property="og:description"]', this.node.description],
            [
              'meta[property="og:url"]',
              `${window.location.origin}${
                lUrl === "/" ? "" : `${encodeURI(lUrl)}/`
              }`,
            ],
            [
              'meta[property="og:image"]',
              this.node.image
                ? `${window.location.origin}/${this.node.image}`
                : "",
            ],
          ].forEach((e) => {
            const element = document.head.querySelector(
              e[0]
            ) as HTMLMetaElement;
            element.content = e[1] ? e[1].replace(/"/g, "&quot;") : "";
          });
          if (this.content === html) this.content = undefined;
          this.content = html;
        }
    },
    /**
     * При изменении индекса создаем роутер
     */
    index() {
      if (!window.frameElement) {
        page();
        this.plainIndex.forEach((node: Branch) => {
          if (node.url) page(node.url, this.route);
          page(node.path, this.route);
        });
      }
    },
  },
  /**
   * Обработчик монтирования приложения
   */
  async mounted() {
    jarallaxVideo();
    this.GLightbox();
    AOS.init();
    [this.index, this.urls] = await Promise.all([
      (await fetch("index.json", { cache: "no-store" })).json(),
      (await fetch("index.cdn.json", { cache: "no-store" })).json(),
    ]);
    this.onhashchange(".pusher");
  },
  /**
   * Обработчик по обновлению контента
   */
  updated() {
    this.GLightbox();
    this.onhashchange();
    window.scrollTo(0, 0);
  },
  methods: {
    /**
     * Обработка роутинга
     *
     * @param {Context} context Объект роутинга
     */
    route(context: Context) {
      this.context = context;
    },
    /**
     * Обработчик загруженного контента
     *
     * @param {string} pSel Селектор
     */
    async onhashchange(pSel: string = "#content") {
      if (this.index) {
        carousel(this.index, pSel);
        deck(this.index, pSel);
        cardgrid(this.index, pSel);
        card(this.index, pSel);
        list(this.index, pSel);
        header(this.index, pSel);
        pageheader(this.index, pSel);
        doubleheader(this.index, pSel);
        icongrid(this.index, pSel);
        breadcrumbs(this.index, pSel);
        pagination(this.index, pSel);
        parentbutton(this.index, pSel);
        sidebar(this.index);
        menu(this.index, pSel);
      }
      this.AOS();
      jarallax(document.querySelectorAll(".jarallax"));
      if (this.scripts) await Promise.allSettled(this.scripts);
      if (typeof init === "function") init.call(this.index);
    },
    /**
     * Обновление AOS после загрузки всех картинок на странице
     */
    async AOS() {
      await Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.addEventListener("load", () => resolve(true));
                img.addEventListener("error", () => resolve(false));
              })
          )
      );
      AOS.refresh();
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
    VRuntimeTemplate,
  },
});
</script>
