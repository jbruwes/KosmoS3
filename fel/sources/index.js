import "core-js/stable";
import "regenerator-runtime/runtime";

import "kendo-ui-core/css/web/kendo.common.css";
import "kendo-ui-core/css/web/kendo.default.css";
import "glightbox/dist/css/glightbox.css";
import "fomantic-ui-css/semantic.css";
import "animate.css/animate.css";
import "hover.css/css/hover.css";
import "aos/dist/aos.css";
import "lightslider/dist/css/lightslider.css";
import "jarallax/dist/jarallax.css";

import "@fontsource/arsenal";
import "@fontsource/bad-script";
import "@fontsource/caveat";
import "@fontsource/comfortaa";
import "@fontsource/cormorant-garamond";
import "@fontsource/cormorant-infant";
import "@fontsource/cormorant-sc";
import "@fontsource/cormorant-unicase";
import "@fontsource/cormorant";
import "@fontsource/jura";
import "@fontsource/marck-script";
import "@fontsource/montserrat";
import "@fontsource/montserrat-alternates";
import "@fontsource/open-sans-condensed";
import "@fontsource/open-sans";
import "@fontsource/oswald";
import "@fontsource/pattaya";
import "@fontsource/poiret-one";
import "@fontsource/roboto-condensed";
import "@fontsource/roboto-mono";
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import "@fontsource/rubik-mono-one";
import "@fontsource/rubik";
import "@fontsource/tenor-sans";

import "./styles/index.css";

import "fomantic-ui-css/semantic";
import "kendo-ui-core/js/kendo.menu";
import "lightslider";
import "pure";
import { jarallax, jarallaxVideo } from "jarallax";
import { createApp, nextTick } from "vue";
import page from "page";
import jsel from "jsel";
import LoadScript from "vue-plugin-load-script";
import glightbox from "./modules/glightbox";
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

window.$ = $;
window.jQuery = jQuery;
$.ajaxSetup({ cache: false });

createApp({
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
        html = await fetch(`${encodeURIComponent(this.node.id)}.htm`, {
          cache: "no-store",
        });
        html = html.status === 200 ? await html.text() : "";
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
      glightbox("#content>main");
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
  async created() {
    jarallaxVideo();
    glightbox("body");
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
      $(`${pSel} .ui.accordion`).accordion();
      $(`${pSel} .ui.embed:not([contenteditable])`)
        .attr("contenteditable", "false")
        .embed();
      const img = document.querySelector("img");
      if (img) {
        if (img.complete) AOS.refresh();
        else img.addEventListener("load", AOS.refresh);
      } else AOS.refresh();
      jarallax(document.querySelectorAll(".jarallax"));
      await Promise.allSettled(this.scripts);
      if (typeof init === "function") init.call(this.index);
    },
  },
})
  .use(LoadScript)
  .mount("body");
