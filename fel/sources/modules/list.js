import getChildren from "./children";
/**
 * Список - вертикальный список заголовков с картинками и анимациями
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function list(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachList() {
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
    /**
     * Возвращает анимацию AOS в шаблон
     *
     * @returns {string} Анимация
     */
    function dataAos() {
      return "fade-left";
    }
    if (dataChildren.length) {
      try {
        $(this)
          .removeData("auto")
          .removeAttr("data-auto")
          .render(dataChildren, {
            "div.item": {
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
                "div.content@data-aos": dataAos,
                // Картинка костыли
                "div.ui.image@data-aos": dataAos,
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
  $(`${sel} [data-id=list][data-auto]`).each(eachList);
  $(`${sel} [data-id=list] div.image:not([contenteditable])`)
    .attr("contenteditable", "false")
    .dimmer({
      transition: "fade up",
      on: "hover",
    });
}
