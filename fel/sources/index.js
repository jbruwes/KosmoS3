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
if (!window.location.origin)
  window.location.origin = `${window.location.protocol}//${
    window.location.hostname
  }${window.location.port ? `:${window.location.port}` : ""}`;
$.ajaxSetup({ cache: false });

createApp({
  /**
   * @returns {object} Объект data
   */
  data: () => ({
    index: null,
    plainIndex: null,
    scripts: null,
  }),
  /**
   *
   */
  async created() {
    [this.index, this.scripts] = await Promise.all([
      (await fetch("index.json", { cache: "no-store" })).json(),
      (await fetch("index.cdn.json", { cache: "no-store" })).json(),
    ]);
    this.plainIndex = jsel(this.index).selectAll("//*[@id]");
    this.getScripts();
    this.setRouter();
    this.onhashchange("body>.pusher");
  },
  /**
   *
   */
  mounted() {
    jarallaxVideo();
    glightbox("body");
    AOS.init();
  },
  methods: {
    /**
     *
     */
    getScripts() {
      this.scripts.push({ url: "index.js" });
      this.scripts = this.scripts
        .filter((script) => script.url)
        .map((script) => $.getScript(script.url));
    },
    /**
     *
     */
    setRouter() {
      this.plainIndex.forEach((node) => {
        const lNode = node;
        lNode.path = jsel(this.index).selectAll(
          `//*[@id="${lNode.id}"]/ancestor-or-self::*[@id]`
        );
        lNode.path = lNode.path.map((e) => e.value.trim().replace(/\s/g, "_"));
        lNode.path.shift();
        lNode.path = `/${lNode.path.join("/")}`;
        if (lNode.path !== "/") {
          page(lNode.path, this.route);
          page(`${lNode.path}/`, this.route);
          page(encodeURI(lNode.path), this.route);
          page(`${encodeURI(lNode.path)}/`, this.route);
        }
      });
      page();
      page("/", this.route);
    },
    /**
     *
     * @param ctx
     */
    async route(ctx) {
      let node = this.plainIndex.find(
        (element) => element.path === ctx.routePath
      );
      if (node) {
        let html = "";
        try {
          html = await fetch(`${encodeURIComponent(node.id)}.htm`, {
            cache: "no-store",
          });
          html = html.status === 200 ? await html.text() : "";
        } finally {
          $("#content>main").html(html);
          glightbox("#content>main");
          this.onhashchange();
          if (!window.location.hash) window.scrollTo(0, 0);
        }
      }
    },
    /**
     *
     * @param sel
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
      // corrector(pSel);
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
