import { jarallax, jarallaxVideo } from "jarallax";
import deck from "./deck";
import carousel from "./carousel";
import cardgrid from "./cardgrid";
import list from "./list";
import breadcrumbs from "./breadcrumbs";
import icongrid from "./icongrid";
import header from "./header";
import pageheader from "./pageheader";
import doubleheader from "./doubleheader";
import menu from "./menu";
import sidebar from "./sidebar";
import pagination from "./pagination";
import parentbutton from "./parentbutton";
import corrector from "./corrector";

jarallaxVideo();

/**
 * Функция вызываемая по событию изменения урла
 *
 * @param {*[]} usrScripts Массив промисов пользовательских подгружаемых
 *  скриптов
 * @param {object.<*>} scripts Объект с промисами подгружаемых скриптов
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function onhashchange(usrScripts, scripts, index, sel) {
  /**
   * Запуск пользовательского скрипта
   */
  function initCall() {
    init.call(index);
  }
  /**
   * Вспомогательная ф-ция для преобразования объекта в массив
   *
   * @param {*} value Текущее обещание
   * @returns {*} Возвращаемое текущее обещание
   */
  function map(value) {
    return value;
  }
  /**
   * Проверка наличия ф-ции init и
   * запуск ожидания загрузки пользовательских скриптов
   */
  function runUsrCode() {
    if (typeof init === "function") {
      $.when(...$.merge($.map(scripts, map), usrScripts)).done(initCall);
    }
  }
  const pSel = sel || "#content";
  carousel(index, pSel);
  deck(index, pSel);
  cardgrid(index, pSel);
  list(index, pSel);
  header(index, pSel);
  pageheader(index, pSel);
  doubleheader(index, pSel);
  icongrid(index, pSel);
  breadcrumbs(index, pSel);
  pagination(index, pSel);
  parentbutton(index, pSel);
  sidebar(index);
  menu(index, pSel);
  corrector(pSel);
  $(`${pSel} .ui.accordion`).accordion();
  $(`${pSel} .ui.embed:not([contenteditable])`)
    .attr("contenteditable", "false")
    .embed();
  $("img").on("load", AOS.refresh);
  AOS.refresh();
  jarallax(document.querySelectorAll(".jarallax"));
  $.when(scripts.indexJs, scripts.indexCdnJson).done(runUsrCode);
}
