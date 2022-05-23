import getChildren from "./children";
/**
 * Список - вертикальный список заголовков с картинками и анимациями
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function parentbutton(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachParentbutton() {
    /**
     * Массив дочерних объектов
     *
     * @type {object[]}
     */
    let dataChildren = getChildren(
      index,
      null,
      null,
      $(this).data("reveal"),
      null,
      $(this).data("path"),
      null,
      "*[@id]",
      "../parent"
    );
    if (!dataChildren.length) {
      dataChildren = getChildren(
        index,
        null,
        null,
        null,
        null,
        $(this).data("path"),
        null,
        "*[@id]",
        "self"
      );
    }
    if (dataChildren.length) {
      try {
        $(this)
          .removeData("auto")
          .removeAttr("data-auto")
          .render(dataChildren[0], {
            ".@href": "$href",
          });
      } catch (e) {
        //
      }
    }
  }
  $(`${sel} [data-id=parentbutton][data-auto]`).each(eachParentbutton);
}
