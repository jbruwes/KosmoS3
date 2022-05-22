import getChildren from "./children";
/**
 * Заголовок динамический на страницу
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function doubleheader(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachDoubleheader() {
    /**
     * Массив дочерних объектов
     *
     * @constant {object[]}
     */
    const dataChildren = getChildren(
      index,
      $(this).data("deep"),
      $(this).data("length"),
      $(this).data("reveal"),
      $(this).data("sort"),
      $(this).data("path"),
      $(this).data("children"),
      "*[@id]"
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
     * Подстановка описания в шаблон в зависимости от флага
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Описание
     */
    function spanSubHeader(a) {
      return description ? a.item.description : "";
    }
    /**
     * Подстановка даты в шаблон в зависимости от флага
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Дата
     */
    function spanUi(a) {
      return date ? a.item.$miniBasicDate : "";
    }
    if (dataChildren.length) {
      try {
        $(this)
          // .removeData("auto")
          // .removeAttr("data-auto")
          .render(dataChildren, {
            "div.column": {
              "i<-": {
                // Заголовок минимум
                "+span.ui": "i.$header",
                "a.ui.header@href": "i.$href",
                "span.sub.header": spanSubHeader,
                // Заголовок костыли
                "span.ui+": spanUi,
                "a.ui.header@class+": " massive icon",
                // Иконки
                "i.icon:not(.calendar)@class+": " #{i.$icon}",
              },
            },
          });
      } catch (e) {
        // console.log(e.message);
      }
    }
  }
  $(`${sel} [data-id=doubleheader][data-auto]`).each(eachDoubleheader);
}
