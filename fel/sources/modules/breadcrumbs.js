import getChildren from "./children";
/**
 * Заголовок динамический на страницу
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function breadcrumbs(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachBreadcrumbs() {
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
      "*[@id]",
      "ancestor-or-self"
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
     * Флаг простановки ссылки на раздел
     *
     * @constant {(number | boolean)}
     */
    const reveal = $(this).data("reveal");
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
     * Функция простановки ссылки на рубрику
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Ссылка
     */
    function href(a) {
      return a.items.length - 1 > a.pos && (reveal || a.item.visible)
        ? a.item.$href
        : "";
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
     * Возвращает класс active если шаг последний
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Класс
     */
    function last(a) {
      if (a.items.length - 1 > a.pos) {
        if (reveal || a.item.visible) return "";
        return " disabled";
      }
      return " active";
    }
    if (dataChildren.length) {
      try {
        $(this)
          .removeData("auto")
          .render(dataChildren, {
            "a.step": {
              "i<-": {
                // Заголовок минимум
                "+span.ui:not(.header)": "i.$header",
                ".@href": href,
                "span.sub.header": spanSubHeader,
                // Заголовок костыли
                "span.content+": spanUi,
                // Иконки
                "i.icon:not(.calendar)@class+": " #{i.$icon}",
                // Последний шаг активный
                ".@class+": last,
              },
            },
          });
      } catch (e) {
        // console.log(e.message);
      }
    }
  }
  $(`${sel} [data-id=breadcrumbs][data-auto]`).each(eachBreadcrumbs);
}
