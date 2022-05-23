import getChildren from "./children";
/**
 * Сетка из карточек - карточки в несколько рядов
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function cardgrid(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachCardgrid() {
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
      "*[string(@image)]"
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
          .removeData("auto")
          .render(dataChildren, {
            "div.column": {
              "i<-": {
                "a.ui.button@href": "i.$href",
                "img.ui.image@src": "i.image",
                // Заголовок минимум
                "+span.ui": "i.$header",
                "a.ui.header@href": "i.$href",
                "span.sub.header": spanSubHeader,
                // Заголовок костыли
                "span.ui+": spanUi,
                "i.hvr-icon@style": "vertical-align:top;padding-top:0.3em;",
                "span.ui@class+": " content",
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
  $(`${sel} [data-id=cardgrid][data-auto]`).each(eachCardgrid);
  $(`${sel} [data-id=cardgrid] div.image:not([contenteditable])`)
    .attr("contenteditable", "false")
    .dimmer({
      transition: "fade up",
      on: "hover",
    });
}
