import getChildren from "./children";
/**
 * Колода - карточки в ряд с горизонтальной прокруткой
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function deck(index, sel) {
  /**
   * Рендер каждой карточки по шаблону
   *
   * @this HTMLElement
   */
  function eachDeck() {
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
          .removeAttr("data-auto")
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
        item: 3,
        auto: true,
        loop: true,
        slideMargin: 0,
        pause: 6500,
        speed: 1000,
        pager: Boolean(pager),
        controls: Boolean(controls),
        onSliderLoad,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              item: 2,
            },
          },
          {
            breakpoint: 768,
            settings: {
              item: 1,
            },
          },
        ],
      });
    } catch (e) {
      // console.log(e.message);
    }
  }
  $(`${sel} [data-id=deck][data-auto]`).each(eachDeck);
  $(`${sel} [data-id=deck]:not([contenteditable])`)
    .attr("contenteditable", "false")
    .each(eachLightSlider);
  $(`${sel} [data-id=deck] div.image:not([contenteditable])`)
    .attr("contenteditable", "false")
    .dimmer({
      transition: "fade up",
      on: "hover",
    });
}
