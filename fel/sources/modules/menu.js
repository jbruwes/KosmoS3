/**
 * Меню классическое
 *
 * @param {object} index Структура сайта
 * @param {string} sel Dom путь
 */
export default function menu(index, sel) {
  /**
   * Функция для преобразования json в формат источника данных kendo
   *
   * @param {string} e Key
   * @param {string} a Value
   * @returns {object} Измененный объект
   */
  function rmenujson(e, a) {
    /**
     * Возвращаемый объект
     */
    const t = {};
    if (a && typeof a === "object" && !Array.isArray(a)) {
      Object.keys(a).forEach((n) => {
        if (Object.hasOwnProperty.call(a, n)) {
          switch (n) {
            case "value":
              t.text = a[n];
              break;
            case "id":
            case "visible":
              t[n] = a[n];
              break;
            case "data":
              t.items = a[n];
              break;
            default:
          }
        }
      });
      return t;
    }
    return a && typeof a === "object" && Array.isArray(a) && !a.length
      ? undefined
      : a;
  }
  /**
   * Функция удаления скрытых элементов
   *
   * @param {object} pIndex Структура меню
   * @param {string} pPath Путь
   * @param {string} pId id
   */
  function hideVisible(pIndex, pPath, pId) {
    /**
     * Счетчик
     *
     * @type {number}
     */
    let i = null;
    /**
     * Текущий id
     *
     * @type {string}
     */
    let id = null;
    /**
     * Текущий путь
     *
     * @type {string}
     */
    let path = null;
    /**
     * Текущий экземпляр структуры меню
     *
     * @type {object}
     */
    const lIndex = pIndex;
    if (lIndex) {
      i = lIndex.length - 1;
      while (i >= 0) {
        if (lIndex[i].visible === undefined || lIndex[i].visible) {
          id =
            pId +
            (pId ? " " : "") +
            lIndex[i].id.toString().replace(/\s/g, "_");
          path = pPath + encodeURIComponent(lIndex[i].text.replace(/\s/g, "_"));
          path += "/";
          lIndex[i].attr = {};
          lIndex[i].attr["data-path"] =
            lIndex[i].id === index[0].id ? "/" : path;
          lIndex[i].attr["data-id"] =
            lIndex[i].id === index[0].id
              ? id.toString().replace(/\s/g, "_")
              : id;
          if (lIndex[i].visible !== undefined) delete lIndex[i].visible;
          if (lIndex[i].items) {
            hideVisible(lIndex[i].items, path, id);
            if (lIndex[i].items.length === 0) delete lIndex[i].items;
          }
        } else lIndex.splice(i, 1);
        i -= 1;
      }
    }
  }
  /**
   * Функция обработки выбора пункта меню
   *
   * @param {object} e Событие
   */
  function select(e) {
    const evt = new CustomEvent("pushstate");
    evt.state = window.location.href;
    setTimeout(function onTimeout() {
      dispatchEvent(evt);
      if (window.onpushstate) window.onpushstate(evt);
    });
    window.history.pushState(
      evt.state,
      document.title,
      `${window.location.origin}/${$(e.item)
        .data("path")
        .replace(/^\/$/, "")}`.replace(/\s/g, "_") + window.location.search
    );
  }
  /**
   * Функция простановки класса выделения
   *
   * @param {number} pIndex Индекс
   * @param {string} value Значение
   */
  function eachId(pIndex, value) {
    $(`.k-item[data-id$="${value}"]`).addClass("k-state-selected");
  }
  /**
   * Функция разбора сохраненных id
   *
   * @this HTMLElement
   */
  function eachItem() {
    $.each($(this).data("id").toString().split(" "), eachId);
  }
  /**
   * Инициализация меню по каждому найденному объекту
   *
   * @this HTMLElement
   */
  function eachMenu() {
    /**
     * @type {object} Источник данных для меню
     */
    let i = null;
    /**
     * @type {object} Объект меню
     */
    let a = null;
    /**
     * @type {object} Копия объекта структуры сайта
     */
    const lIndex = JSON.parse(JSON.stringify(index));
    /**
     * @type {string} Тип коллизий
     */
    let popupCollision = $(this).data("popup-collision");
    if (typeof popupCollision === "undefined") popupCollision = "horizontal";
    if (popupCollision === true) popupCollision = "";

    if (lIndex[0].visible) {
      if (!lIndex[0].data) lIndex[0].data = [];
      lIndex[0].data.unshift({
        id: lIndex[0].id,
        value: lIndex[0].value,
        visible: lIndex[0].visible,
      });
    }
    if (lIndex[0].data && lIndex[0].data.length) {
      i = JSON.parse(JSON.stringify(lIndex[0].data, rmenujson));
      hideVisible(i, "", "");
      a = $("<ul></ul>");
      $(this).css("overflow", "visible");
      $(this).parent().css("overflow", "visible");
      $(this).append(a);
      a.kendoMenu({
        scrollable:
          typeof $(this).data("scrollable") === "undefined"
            ? true
            : $(this).data("scrollable"),
        animation:
          // typeof $(this).data("animation") === "undefined"? {} : $(this).data("animation") === true ? {} : $(this).data("animation"),
          typeof $(this).data("animation") === "undefined" ||
          $(this).data("animation") === true
            ? {}
            : $(this).data("animation"),
        closeOnClick:
          typeof $(this).data("close-on-click") === "undefined"
            ? true
            : $(this).data("close-on-click"),
        direction:
          typeof $(this).data("direction") === "undefined"
            ? "default"
            : $(this).data("direction"),
        hoverDelay:
          typeof $(this).data("hover-delay") === "undefined"
            ? 100
            : $(this).data("hover-delay"),
        openOnClick:
          typeof $(this).data("open-on-click") === "undefined"
            ? false
            : $(this).data("open-on-click"),
        orientation:
          typeof $(this).data("orientation") === "undefined"
            ? "horizontal"
            : $(this).data("orientation"),
        popupCollision,
        dataSource: i,
        // пока нет параметра loadOnDemand: false,
        // фиксируем версию на 2019.1.220
        select,
      });
    }
  }
  $(`${sel} [data-id=rmenu]:not([contenteditable])`)
    .attr("contenteditable", "false")
    .empty()
    .each(eachMenu);
  $(".k-item").removeClass("k-state-selected");
  const hash = decodeURIComponent(window.location.pathname)
    .replace(/_/g, " ")
    .replace(/%2f/g, "/")
    .replace(/%2F/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
  $(`.k-item[data-path="${encodeURI(hash.replace(/\s/g, "_"))}/"]`).each(
    eachItem
  );
}
