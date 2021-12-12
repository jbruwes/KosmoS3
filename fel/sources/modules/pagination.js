import getChildren from "./children";
/**
 * Список - вертикальный список заголовков с картинками и анимациями
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function pagination(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachPagination() {
    /**
     * Массив дочерних объектов
     *
     * @type {object[]}
     */
    let dataChildren = getChildren(
      index,
      $(this).data("deep"),
      $(this).data("length"),
      $(this).data("reveal"),
      $(this).data("sort"),
      $(this).data("path"),
      $(this).data("children"),
      "*/*[@id]",
      "parent"
    );
    if (!dataChildren.length) {
      dataChildren = getChildren(
        index,
        $(this).data("deep"),
        $(this).data("length"),
        $(this).data("reveal"),
        $(this).data("sort"),
        $(this).data("path"),
        $(this).data("children"),
        "*[@id]",
        "self"
      );
    }
    const hash = decodeURIComponent(window.location.pathname)
      .replace(/_/g, " ")
      .replace(/%2f/g, "/")
      .replace(/%2F/g, "/")
      .replace(/\/+/g, "/")
      .replace(/^\/+|\/+$/g, "");
    /**
     * Индекс текущей страницы
     *
     * @constant {number}
     */
    const curIndex = dataChildren.findIndex(
      (element) =>
        element.$href.replace(/^\/|\/$/g, "").replace(/_/g, " ") === hash
    );
    /**
     * Функция возвращает порядковый номер рубрики
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {number} Номер рубрики
     */
    function position(a) {
      return a.pos + 1;
    }
    /**
     * Функция простановки ссылки на рубрику
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Ссылка
     */
    function href(a) {
      return curIndex !== a.pos ? a.item.$href : "";
    }
    /**
     * Возвращает класс active для текущего объекта
     *
     * @param {object} a Текущий объект требующий обшаблонивания
     * @returns {string} Класс
     */
    function visible(a) {
      return curIndex !== a.pos ? "" : " active";
    }
    if (dataChildren.length) {
      /**
       * Двойной левый шеврон
       *
       * @type {object}
       */
      const doubleLeft = $(
        '<a class="item"><i class="angle double left icon"><!-- --></i></a>'
      );
      /**
       * Двойной правый шеврон
       *
       * @type {object}
       */
      const doubleRight = $(
        '<a class="item"><i class="angle double right icon"><!-- --></i></a>'
      );
      /**
       * Левый шеврон
       *
       * @type {object}
       */
      const left = $(
        '<a class="item"><i class="angle left icon"><!-- --></i></a>'
      );
      /**
       * Правый шеврон
       *
       * @type {object}
       */
      const right = $(
        '<a class="item"><i class="angle right icon"><!-- --></i></a>'
      );
      if (curIndex > 2) {
        $(this).prepend(
          '<a class="disabled item"><i class="ellipsis horizontal icon"><!-- --></i></a>'
        );
      }
      if (curIndex > 0) {
        left.attr("href", dataChildren[curIndex - 1].$href);
        doubleLeft.attr("href", dataChildren[0].$href);
      } else {
        left.addClass("disabled");
        doubleLeft.addClass("disabled");
      }
      $(this).prepend(left);
      $(this).prepend(doubleLeft);
      if (curIndex < dataChildren.length - 3) {
        $(this).append(
          '<a class="disabled item"><i class="ellipsis horizontal icon"><!-- --></i></a>'
        );
      }
      if (curIndex < dataChildren.length - 1) {
        right.attr("href", dataChildren[curIndex + 1].$href);
        doubleRight.attr("href", dataChildren[dataChildren.length - 1].$href);
      } else {
        right.addClass("disabled");
        doubleRight.addClass("disabled");
      }
      $(this).append(right);
      $(this).append(doubleRight);
      try {
        $(this)
          .removeData("auto")
          .removeAttr("data-auto")
          .render(dataChildren, {
            "a.item:empty": {
              "i<-": {
                ".": position,
                ".@href": href,
                ".@class+": visible,
              },
              /**
               * @param a
               */
              filter(a) {
                /**
                 * Проверочный сдвиг слева
                 *
                 * @type {number}
                 */
                const rightShift = 3 + (curIndex < 3 ? 2 - curIndex : 0);
                /**
                 * Проверочный сдвиг справа
                 *
                 * @type {number}
                 */
                const leftShift =
                  3 -
                  (curIndex > dataChildren.length - 3
                    ? dataChildren.length - curIndex - 3
                    : 0);
                return (
                  curIndex - leftShift < a.pos && a.pos < curIndex + rightShift
                );
              },
            },
          });
      } catch (e) {
        //
      }
    }
  }
  $(`${sel} [data-id=pagination][data-auto]`).each(eachPagination);
}
