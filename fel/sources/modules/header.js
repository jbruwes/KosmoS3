import getChildren from "./children";
/**
 * Заголовок динамический на страницу
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function header(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachHeader() {
    /**
     * Массив дочерних объектов
     *
     * @constant {object[]}
     */
    const dataChildren = getChildren(
      index,
      null,
      null,
      null,
      null,
      $(this).data("path")
    );
    /**
     * Флаг простановки даты
     *
     * @constant {(number | boolean)}
     */
    const date = $(this).data("date");
    /**
     * Флаг простановки описания
     *
     * @constant {(number | boolean)}
     */
    const description = $(this).data("description");
    /**
     * CSV путей до дочерних объектов
     *
     * @constant {string}
     */
    const unlink = $(this).data("path");
    /**
     * Подстановка описания в шаблон в зависимости от флага
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Описание
     */
    function spanSubHeader(a) {
      return description ? a.context.description : "";
    }
    /**
     * Подстановка даты в шаблон в зависимости от флага
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Дата
     */
    function spanUi(a) {
      return date ? a.context.$miniBasicDate : "";
    }
    /**
     * Подстановка ссылки в шаблон на заголовок
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Ссылка
     */
    const aUiHeader = (a) => {
      return unlink
        ? a.context.$href
        : $(this).find("a.ui.header").attr("href");
    };
    if (dataChildren.length) {
      try {
        $(this).removeData("auto").render(dataChildren[0], {
          // Заголовок минимум
          "+span.ui": "$header",
          "a.ui.header@href": aUiHeader,
          "span.sub.header": spanSubHeader,
          // Заголовок костыли
          "div.content+": spanUi,
          "i.hvr-icon@style": "vertical-align:top;padding-top:0.3em;",
          "span.ui@class+": " content",
          "a.ui.header@class+": " massive dividing fluid container",
          // Иконки
          "i.icon:not(.calendar)@class+": " #{$icon}",
        });
      } catch (e) {
        // console.log(e.message);
      }
    }
  }
  $(`${sel} [data-id=header][data-auto]`).each(eachHeader);
}
