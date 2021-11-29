import regex from "./regex";
/**
 * Функция запуска галлереи для фото на странице
 *
 * @param {string} sel Dom путь
 */
export default function lightcase(sel) {
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
    .data("rel", `lightcase:${$(sel).prop("nodeName")}`)
    .attr("data-rel", `lightcase:${$(sel).prop("nodeName")}`);
  $(sel)
    .find(
      'a:regex("href,' +
        "((youtube\\.com|youtu\\.be|youtube-nocookie\\.com)\\/" +
        "(watch\\?v=|v\\/|u\\/|embed\\/?)?" +
        '(videoseries\\?list=(.*)|[\\w-]{11}|\\?listType=(.*)&list=(.*)).*)")'
    )
    .data("rel", "lightcase")
    .attr("data-rel", "lightcase");
  $(sel).find("a[data-rel^=lightcase]").lightcase({
    maxWidth: "auto",
    maxHeight: "auto",
  });
}
