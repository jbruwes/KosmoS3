import GLightbox from "glightbox";
import regex from "./regex";
/**
 * Функция запуска галлереи для фото на странице
 *
 * @param {string} sel Dom путь
 */
export default function glightbox(sel) {
  /**
   * Кодирует частично закодированную ссылку через раскодировку
   *
   * @this HTMLElement
   */
  function encodeHref() {
    $(this).attr("href", encodeURI(decodeURI($(this).attr("href"))));
  }
  $.expr.pseudos.regex = regex;
  $(sel)
    .find(
      'a:regex("href,' +
        "(^data:image\\/.*,)|" +
        "(\\.(jp(e|g|eg)|gif|png|bmp|webp|svg)" +
        '((\\?|#).*)?$)")'
    )
    .each(encodeHref)
    .attr("rel", "external")
    .addClass("glightbox");
  $(sel)
    .find(
      'a:regex("href,' +
        "((youtube\\.com|youtu\\.be|youtube-nocookie\\.com)\\/" +
        "(watch\\?v=|v\\/|u\\/|embed\\/?)?" +
        '(videoseries\\?list=(.*)|[\\w-]{11}|\\?listType=(.*)&list=(.*)).*)")'
    )
    .attr("rel", "external")
    .addClass("glightbox");
  GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    zoomable: false,
  });
}
