import "core-js/stable";
import "regenerator-runtime/runtime";

import "kendo-ui-core/css/web/kendo.common.css";
import "kendo-ui-core/css/web/kendo.default.css";
import "lightcase/src/css/lightcase.css";
import "fomantic-ui-css/semantic.css";
import "animate.css/animate.css";
import "hover.css/css/hover.css";
import "aos/dist/aos.css";
import "lightslider/dist/css/lightslider.css";
import "jarallax/dist/jarallax.css";

import "@fontsource/alegreya";
import "@fontsource/alegreya-sans";
import "@fontsource/alegreya-sans-sc";
import "@fontsource/alegreya-sc";
import "@fontsource/alice";
import "@fontsource/amatic-sc";
import "@fontsource/andika";
import "@fontsource/anonymous-pro";
import "@fontsource/arimo";
import "@fontsource/arsenal";
import "@fontsource/bad-script";
import "@fontsource/caveat";
import "@fontsource/comfortaa";
import "@fontsource/cormorant-garamond";
import "@fontsource/cormorant-infant";
import "@fontsource/cormorant-sc";
import "@fontsource/cormorant-unicase";
import "@fontsource/cormorant";
import "@fontsource/cousine";
import "@fontsource/cuprum";
import "@fontsource/didact-gothic";
import "@fontsource/eb-garamond";
import "@fontsource/el-messiri";
import "@fontsource/exo-2";
import "@fontsource/fira-code";
import "@fontsource/fira-mono";
import "@fontsource/fira-sans-condensed";
import "@fontsource/fira-sans-extra-condensed";
import "@fontsource/fira-sans";
import "@fontsource/forum";
import "@fontsource/gabriela";
import "@fontsource/ibm-plex-mono";
import "@fontsource/ibm-plex-sans";
import "@fontsource/ibm-plex-serif";
import "@fontsource/istok-web";
import "@fontsource/jura";
import "@fontsource/kelly-slab";
import "@fontsource/kosugi";
import "@fontsource/kosugi-maru";
import "@fontsource/kurale";
import "@fontsource/ledger";
import "@fontsource/literata";
import "@fontsource/lobster";
import "@fontsource/lora";
import "@fontsource/m-plus-1p";
import "@fontsource/m-plus-rounded-1c";
import "@fontsource/marck-script";
import "@fontsource/marmelad";
import "@fontsource/merriweather";
import "@fontsource/montserrat";
import "@fontsource/montserrat-alternates";
import "@fontsource/neucha";
import "@fontsource/noto-sans";
import "@fontsource/noto-sans-sc";
import "@fontsource/noto-serif";
import "@fontsource/noto-serif-sc";
import "@fontsource/noto-serif-tc";
import "@fontsource/old-standard-tt";
import "@fontsource/open-sans-condensed";
import "@fontsource/open-sans";
import "@fontsource/oranienbaum";
import "@fontsource/oswald";
import "@fontsource/pacifico";
import "@fontsource/pangolin";
import "@fontsource/pattaya";
import "@fontsource/philosopher";
import "@fontsource/play";
import "@fontsource/playfair-display-sc";
import "@fontsource/playfair-display";
import "@fontsource/podkova";
import "@fontsource/poiret-one";
import "@fontsource/prata";
import "@fontsource/press-start-2p";
import "@fontsource/prosto-one";
import "@fontsource/pt-mono";
import "@fontsource/pt-sans-caption";
import "@fontsource/pt-sans-narrow";
import "@fontsource/pt-sans";
import "@fontsource/pt-serif-caption";
import "@fontsource/pt-serif";
import "@fontsource/roboto-condensed";
import "@fontsource/roboto-mono";
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import "@fontsource/rubik-mono-one";
import "@fontsource/rubik";
import "@fontsource/ruslan-display";
import "@fontsource/russo-one";
import "@fontsource/sawarabi-gothic";
import "@fontsource/scada";
import "@fontsource/seymour-one";
import "@fontsource/source-code-pro";
import "@fontsource/source-sans-pro";
import "@fontsource/spectral";
import "@fontsource/spectral-sc";
import "@fontsource/stalinist-one";
import "@fontsource/tenor-sans";
import "@fontsource/tinos";
import "@fontsource/ubuntu-condensed";
import "@fontsource/ubuntu-mono";
import "@fontsource/ubuntu";
import "@fontsource/underdog";
import "@fontsource/vollkorn";
import "@fontsource/vollkorn-sc";
import "@fontsource/yanone-kaffeesatz";
import "@fontsource/yeseva-one";

import "./styles/index.css";

import "fomantic-ui-css/semantic";
import "kendo-ui-core/js/kendo.menu";
import "lightcase";
import "lightslider";
import "pure";
import "onpushstate";
import onhashchange from "./modules/onhashchange";
import lightcase from "./modules/lightcase";
import cont from "./modules/cont";
import sidebar from "./modules/sidebar";

window.$ = $;
window.jQuery = jQuery;
/**
 * Объект с промисами подгружаемых скриптов
 *
 * @constant {object.<*>}
 */
const scripts = {
  indexJs: $.Deferred(),
  indexJson: $.Deferred(),
  indexCdnJson: $.Deferred(),
};
/**
 * Структура вебсайта
 *
 * @type {object}
 */
let index = {};
/**
 * Массив промисов пользовательских подгружаемых скриптов
 *
 * @type {*[]}
 */
let usrScripts = [];
/**
 * Функция загрузки пользовательских скриптов
 *
 * @param {object} val Объект с путем для загрузки скрипта
 * @returns {*} Обещание загрузки скрипта
 */
function getScriptFromArray(val) {
  if (Object.prototype.hasOwnProperty.call(val, "url") && val.url)
    return $.getScript(val.url);
  return false;
}
/**
 * Наполнения массива обещаниями загрузки пользовательских скриптов
 *
 * @param {object} data Загруженный index.cdn.json
 */
function defIndexCdnJsonDone(data) {
  usrScripts = $.map(data, getScriptFromArray);
}
/**
 * Присвоение структуры сайта
 *
 * @param {object} data Загруженный index.json
 */
function defIndexJsonDone(data) {
  index = data;
}
/**
 * Обработчик события popstate & pushstate
 */
function onChangeState() {
  cont(usrScripts, scripts, index);
}
/**
 * Обработчик, запускаемый после загрузки структуры сайта
 */
function indexJSONDone() {
  sidebar(index);
  $(window).on("popstate", onChangeState);
  $(window).on("pushstate", onChangeState);
  if (window.location !== window.parent.location) {
    $(window).trigger("popstate");
  }
  onhashchange(usrScripts, scripts, index, "body>.pusher");
}
/**
 * Обработчик, запускаемый после загрузки документа
 */
function readyFn() {
  lightcase("body");
  AOS.init();
  $.when(scripts.indexJson).done(indexJSONDone);
}
// jarallaxVideo();
if (!window.location.origin) {
  window.location.origin = `${window.location.protocol}//${
    window.location.hostname
  }${window.location.port ? `:${window.location.port}` : ""}`;
}
$("<link>")
  .appendTo("head")
  .attr({ type: "text/css", rel: "stylesheet" })
  .attr("href", "index.cdn.css");
$("<link>")
  .appendTo("head")
  .attr({ type: "text/css", rel: "stylesheet" })
  .attr("href", "index.css");
$.ajaxSetup({ cache: true });
$.getScript("index.js").done(scripts.indexJs.resolve);
$.getJSON("index.json", defIndexJsonDone).done(scripts.indexJson.resolve);
$.getJSON("index.cdn.json", defIndexCdnJsonDone).done(
  scripts.indexCdnJson.resolve
);
if (document.readyState !== "loading") {
  readyFn();
} else {
  document.addEventListener("DOMContentLoaded", readyFn);
}
