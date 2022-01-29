import regex from "./regex";
/**
 * Функция корректор ссылок в загруженном документе
 *
 * @param {string} sel Dom путь
 */
export default function corrector(sel) {
  /**
   * Функция привидения ссылок к корню сайта
   *
   * @this HTMLElement
   */
  function toRoot() {
    try {
      const href = new URL(this.href);
      this.href = `${window.location.origin}${window.location.pathname.replace(
        /\/$/,
        ""
      )}${href.pathname}${href.search ? href.search : window.location.search}${
        href.hash ? href.hash : window.location.hash
      }`;
    } catch (e) {
      // console.log(e);
    }
  }
  $.expr.pseudos.regex = regex;
  $(sel)
    .find(
      ':not([class|="glightbox"]) a:not(a:regex("href,(^(\\/|\\w+:))|(\\.\\w+((\\?|#).*)?$)"))'
    )
    .each(toRoot);
}
