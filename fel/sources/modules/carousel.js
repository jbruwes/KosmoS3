import getChildren from "./children";
/**
 * Слайдер - большой слайд с кнопками <, > и пейджером в нижней части
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function carousel(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachCarousel() {
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
      return date ? a.item.$date : "";
    }
    if (dataChildren.length) {
      try {
        $(this)
          // .removeData("auto")
          // .removeAttr("data-auto")
          .render(dataChildren, {
            "div.segment": {
              "i<-": {
                "@style+": "i.$backgroundImage",
                // Заголовок минимум
                "+span.ui": "i.$header",
                "a.ui.header@href": "i.$href",
                "span.sub.header": spanSubHeader,
                // Заголовок костыли
                "span.ui+": spanUi,
                "a.ui.header@class+": " massive inverted icon",
                // Иконки
                "i.icon:not(.calendar)@class+": " #{i.icon}",
              },
            },
          });
      } catch (e) {
        // console.log(e.message);
      }
    }
  }
  /**
   * Инициализация слайдера для каждого подходящего объекта
   *
   * @this HTMLElement
   */
  function eachLightSlider() {
    /**
     * Флаг указывающий на использования точек для переключения между слайдами
     *
     * @constant {(number | boolean)}
     */
    const pager = $(this).data("pager");
    /**
     * Флаг указывающий на наличие кнопок вперед/назад
     *
     * @constant {(number | boolean)}
     */
    const controls = $(this).data("controls");
    /**
     * Показываем объект после загрузки слайдера
     *
     * @param {object} el Объект на который загружен слайдер
     */
    function onSliderLoad(el) {
      $(el).children("div").removeAttr("hidden");
    }
    try {
      $(this).lightSlider({
        item: 1,
        auto: true,
        loop: true,
        slideMargin: 0,
        pause: 6500,
        speed: 1000,
        pager: Boolean(pager),
        controls: typeof controls === "undefined" || Boolean(controls),
        onSliderLoad,
      });
    } catch (e) {
      // console.log(e.message);
    }
  }
  $(`${sel} [data-id=carousel][data-auto]`).each(eachCarousel);
  $(`${sel} [data-id=carousel]:not([contenteditable])`)
    .attr("contenteditable", "false")
    .each(eachLightSlider);
}
