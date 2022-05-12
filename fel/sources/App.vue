<script>
import { defineComponent, nextTick } from "vue";
import { jarallax, jarallaxVideo } from "jarallax";
import page from "page";
import jsel from "jsel";
import GLightbox from "glightbox";
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
   * @returns {object} Объект data
   */
  data: () => ({
    index: null,
    urls: null,
    content: null,
    context: { routePath: null },
  }),
  computed: {
    /**
     * Пользовательские скрипты
     *
     * @returns {Array} Массив обещаний по зпгрузке пользовательских скриптов
     */
    scripts() {
      return [...this.urls, { url: "index.js" }]
        .filter((script) => script.url)
        .map((script) => this.$loadScript(script.url));
    },
    /**
     * Текущий объект
     *
     * @returns {object} Текущий объект для загрузки
     */
    node() {
      return this.plainIndex.find(
        (e) =>
          e.path === this.context.routePath || e.url === this.context.routePath
      );
    },
    /**
     * Плоский индекс
     *
     * @returns {object} Плоский индекс для поиска
     */
    plainIndex() {
      const plainIndex = jsel(this.index).selectAll("//*[@id]");
      plainIndex.forEach((node) => {
        const lNode = node;
        lNode.path = jsel(this.index).selectAll(
          `//*[@id="${lNode.id}"]/ancestor-or-self::*[@id]`
        );
        lNode.path = lNode.path.map((e) => e.value.trim().replace(/\s/g, "_"));
        lNode.path.shift();
        lNode.path = `/${lNode.path.join("/")}`;
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
      try {
        const response = await fetch(
          `${encodeURIComponent(this.node.id)}.htm`,
          {
            cache: "no-store",
          }
        );
        html = response.status === 200 ? await response.text() : "";
      } finally {
        document.title = (
          this.node.title ? this.node.title : this.node.value
        ).replace(/"/g, "&quot;");
        const lUrl = this.node.url || this.context.routePath;
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
          document.head.querySelector(e[0]).content = e[1]
            ? e[1].replace(/"/g, "&quot;")
            : "";
        });
        this.content = html;
      }
    },
    /**
     * При изменении контента на странице обновляем компоненты
     */
    async content() {
      await nextTick();
      this.GLightbox();
      this.onhashchange();
      if (!window.location.hash) window.scrollTo(0, 0);
    },
    /**
     * При изменении индекса создаем роутер
     */
    index() {
      if (!window.frameElement) {
        page();
        this.plainIndex.forEach((node) => {
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
  methods: {
    /**
     * Обработка роутинга
     *
     * @param {object} context Объект роутинга
     */
    route(context) {
      this.context = context;
    },
    /**
     * Обработчик загруженного контента
     *
     * @param {string} sel Селектор
     */
    async onhashchange(sel) {
      const pSel = sel || "#content";
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
      this.AOS();
      jarallax(document.querySelectorAll(".jarallax"));
      await Promise.allSettled(this.scripts);
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
});
</script>
