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
import { createApp } from "vue";
import page from "page";
import jsel from "jsel";
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
    plainIndex: null,
    scripts: null,
  }),
  /**
   * Обработчик создания приложения
   */
  async created() {
    [this.index, this.scripts] = await Promise.all([
      (await fetch("index.json", { cache: "no-store" })).json(),
      (await fetch("index.cdn.json", { cache: "no-store" })).json(),
    ]);
    this.setPlainIndex();
    this.getScripts();
    if(!window.frameElement)this.setRouter();
    this.onhashchange(".pusher");
  },
  /**
   * Обработчик монтирования приложения
   */
  mounted() {
    jarallaxVideo();
    glightbox("body");
    AOS.init();
  },
  methods: {
    /**
     * Заполнение массива загрузки пользовательских скриптов
     */
    getScripts() {
      this.scripts.push({ url: "index.js" });
      this.scripts = this.scripts
        .filter((script) => script.url)
        .map((script) => $.getScript(script.url));
    },
    /**
     * Заполнение плоского индекса
     */
    setPlainIndex() {
      this.plainIndex = jsel(this.index).selectAll("//*[@id]");
      this.plainIndex.forEach((node) => {
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
    },
    /**
     * Инициализация роутера
     */
    setRouter() {
      this.plainIndex.forEach((node) => {
        if (node.url) page(node.url, this.route);
        if (node.path !== "/") page(node.path, this.route);
      });
      page();
      page("/", this.route);
    },
    /**
     * Обработка роутинга
     *
     * @param {object} ctx Объект роутинга
     */
    async route(ctx) {
      const node = this.plainIndex.find(
        (e) => e.path === ctx.routePath || e.url === ctx.routePath
      );
      if (node) {
        let html = "";
        try {
          html = await fetch(`${encodeURIComponent(node.id)}.htm`, {
            cache: "no-store",
          });
          html = html.status === 200 ? await html.text() : "";
        } finally {
          document.title = (node.title ? node.title : node.value).replace(
            /"/g,
            "&quot;"
          );
          const lUrl = node.url || ctx.routePath;
          [
            ['meta[name="description"]', node.description],
            ['meta[name="keywords"]', node.keywords],
            ['meta[property="og:title"]', document.title],
            ['meta[property="og:description"]', node.description],
            [
              'meta[property="og:url"]',
              `${window.location.origin}${
                lUrl === "/" ? "" : `${encodeURI(lUrl)}/`
              }`,
            ],
            [
              'meta[property="og:image"]',
              node.image ? `${window.location.origin}/${node.image}` : "",
            ],
          ].forEach((e) => {
            document.head.querySelector(e[0]).content = e[1]
              ? e[1].replace(/"/g, "&quot;")
              : "";
          });
          $("#content>main").html(html);
          glightbox("#content>main");
          this.onhashchange();
          if (!window.location.hash) window.scrollTo(0, 0);
        }
      }
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
      $("img").on("load", AOS.refresh);
      AOS.refresh();
      jarallax(document.querySelectorAll(".jarallax"));
      await Promise.allSettled(this.scripts);
      if (typeof init === "function") init.call(this.index);
    },
  },
}).mount("body");
