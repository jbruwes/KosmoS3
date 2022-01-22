/**
 * Сайдбар - супер турбо меню
 *
 * @param {object} index Структура сайта
 */
export default function sidebar(index) {
  /**
   * Айди таймера
   *
   * @type {number}
   */
  const timerId = null;
  /**
   * Корневой элемент меню
   *
   * @type {object}
   */
  let first;
  /**
   * Флаг включения турбоменю на сайте
   *
   * @type {boolean}
   */
  const flSidebar = $("#content").data("turbomenu");
  /**
   * Инициализация динамического меню
   *
   * @param {number} idx Элемент
   * @param {string} phref Урл
   * @param {string} pid Айдишник
   */
  function ddInit(idx, phref, pid) {
    /**
     * Рассчетный флаг дочерних элементов с учетом видимости
     *
     * @type {boolean}
     */
    let empty = true;
    /**
     * Заготовка для пункта меню
     *
     * @type {object}
     */
    let item = null;
    /**
     * Заготовка для заголовка
     *
     * @type {object}
     */
    let title = null;
    /**
     * Заготовка для содержимого
     *
     * @type {object}
     */
    let content = null;
    /**
     * Заготовка для группы полей
     *
     * @type {object}
     */
    let fields = null;
    /**
     * Заготовка для формы
     *
     * @type {object}
     */
    let form = null;
    /**
     * Заготовка для поля
     *
     * @type {object}
     */
    let field = null;
    /**
     * Заготовка для чекбокса
     *
     * @type {object}
     */
    let checkbox = null;
    /**
     * Текущий урл для элемента меню
     *
     * @type {string}
     */
    let href = null;
    /**
     * Текущий айди
     *
     * @type {string}
     */
    let id = null;
    /**
     * Поиск хотя бы одного видимого дочернего элемента
     *
     * @param {object} val Объект структуры сайта
     * @returns {boolean} Прекращать или нет обход
     */
    function initEmpty(val) {
      if (val.visible) empty = false;
      return empty;
    }
    /**
     * Создание пунктов меню и вызов рекурсии
     *
     * @param {object} val Объект структуры сайта
     */
    function eachIndex(val) {
      if (val.visible) {
        href = `${phref + val.value}/`;
        id = `${pid} ${val.id.toString().replace(/\s/g, "_")}`;
        field = $("<div>", {
          class: "field",
        });
        empty = true;
        if (val.data) val.data.forEach(initEmpty);
        checkbox = $("<div>", {
          class: "ui slider checkbox",
          html: `<input type="radio" name="${
            idx.value
          }"><label><span><i class="${
            !empty ? "folder outline" : "file alternate outline"
          } icon"></i>${val.value}</span></label>`,
          "data-href": href,
          "data-id": id,
        });
        field.append(checkbox);
        fields.append(field);
        ddInit(val, href, id);
      }
    }
    if (idx.data && idx.data.length) {
      idx.data.forEach(initEmpty);
      if (!empty) {
        item = $("<div>", {
          class: "item",
          "data-id": pid,
        });
        title = $("<a>", {
          class: "title",
          html: `${
            '<i class="dropdown icon"></i>' +
            '<i class="folder open outline icon"></i>'
          }${idx.value}`,
        });
        content = $("<div>", {
          class: "content",
        });
        fields = $("<div>", {
          class: "grouped fields",
        });
        form = $("<div>", {
          class: "ui form",
        });
        field = null;
        checkbox = null;
        href = null;
        id = null;
        $("body>.ui.sidebar").append(item);
        item.append(title);
        item.append(content);
        content.append(form);
        form.append(fields);
        idx.data.forEach(eachIndex);
      }
    }
  }
  /**
   * Управление видимостью верхнего меню
   *
   * @param {object} e Объект события
   */
  function topMenuVisibility(e) {
    /**
     * Функция скрытия меню по таймауту
     */
    function onTimeOut() {
      $("body>.ui.main.menu").stop(true, true).fadeTo("fast", 0);
    }
    if ($("body>.ui.sidebar").sidebar("is hidden")) {
      clearTimeout(e.data.timerId);
      if (e.data.timeout) {
        e.data.timerId = setTimeout(onTimeOut, e.data.timeout);
      }
      $("body>.ui.main.menu").stop(true, true).fadeTo("fast", e.data.fade);
    }
  }
  /**
   * Обработчик клика на элемент меню
   *
   * @this HTMLElement
   * @param {*} e Объект события
   * @returns {boolean} Прерывание дальнейшей обработки клика
   */
  function click(e) {
    /**
     * Урл для перехода
     *
     * @type {string}
     */
    let href = "";
    if (e) {
      if (!$(e.target).hasClass("item") && !$(e.target).hasClass("home")) {
        href = $(e.target)
          .parentsUntil(".ui.slider.checkbox")
          .parent()
          .data("href");
      }
      $("body>.ui.sidebar").sidebar("hide");
    } else href = $(this).parent().data("href");
    const evt = new CustomEvent("pushstate");
    evt.state = window.location.href;
    setTimeout(function onTimeout() {
      dispatchEvent(evt);
      if (window.onpushstate) window.onpushstate(evt);
    });
    window.history.pushState(
      evt.state,
      document.title,
      `${window.location.origin}/${href.replace(/^\/$/, "")}`.replace(
        /\s/g,
        "_"
      ) + window.location.search
    );
    return false;
  }
  /**
   * Обработчик появления сайдбара
   */
  function onVisible() {
    $(window).off("scroll");
  }
  /**
   * Обработчик скрытия сайдбара
   */
  function onHidden() {
    $(window).on(
      "scroll",
      { fade: 1, timeout: 1800, timerId },
      topMenuVisibility
    );
  }
  /**
   * Запуск сайдбара по клику на сендвич
   */
  function launch() {
    topMenuVisibility({ data: { fade: 0, timerId } });
    $("body>.ui.sidebar").sidebar("show");
  }
  /**
   * Включение нужных чекбоксов и скрытие при необходимости
   *
   * @param {number} idx Индекс
   * @param {string} value Текущее айди
   */
  function sidebarCheck(value) {
    $(`body>.ui.sidebar .ui.checkbox[data-id$="${value}"]`).checkbox(
      "set checked"
    );
    $(`body>.ui.sidebar .item[data-id$="${value}"]`).attr("hidden", false);
  }
  /**
   * Открытие сайдбара на текущий урл
   *
   * @this HTMLElement
   */
  function updateSidebar() {
    /**
     * Массив сохраненных в элементе айдишников в виде пути
     *
     * @type {Array[]}
     */
    let id = null;
    /**
     * Текущий элемент меню
     *
     * @type {object}
     */
    let sel = null;
    $("body>.ui.main.menu>.header.item").html($(this).text());
    id = $(this).data("id").toString().split(" ");
    sel = $(`body>.ui.sidebar .item[data-id$="${id[id.length - 1]}"]`).index(
      "body>.ui.sidebar .item[data-id]"
    );
    if (sel < 0) {
      sel = $(`body>.ui.sidebar .item[data-id$="${id[id.length - 2]}"]`).index(
        "body>.ui.sidebar .item[data-id]"
      );
    }
    $("body>.ui.sidebar .item[data-id]").attr("hidden", true);
    id.forEach(sidebarCheck);
    $("body>.ui.sidebar.accordion").accordion("open", sel);
  }
  if (typeof flSidebar === "undefined" || Boolean(flSidebar)) {
    if ($("body>.ui.sidebar").is(":empty")) {
      $("body>.ui.main.menu").removeAttr("hidden");
      $("body>.ui.sidebar").sidebar("setting", {
        exclusive: true,
        scrollLock: true,
        returnScroll: true,
        onVisible,
        onHidden,
      });
      if (index[0].visible) {
        $("body>.ui.sidebar").append(
          $("<a>", {
            class: "item",
            "data-href": "",
            html: `<i class="home icon"></i>${index[0].value}`,
          })
        );
        $("body>.ui.sidebar.menu a.item").on("click", click);
      }
      ddInit(index[0], "", index[0].id.toString().replace(/\s/g, "_"));
      $(".ui.checkbox").checkbox({
        onChecked: click,
      });
      $(".ui.checkbox span").on("click", click);
      $("body>.ui.sidebar.accordion").accordion();
      $("body>.ui.main.menu").on(
        "mouseenter",
        { fade: 1, timerId },
        topMenuVisibility
      );
      $("body>.ui.main.menu").on(
        "mouseleave",
        { fade: 0, timerId },
        topMenuVisibility
      );
      $(window).on(
        "scroll",
        { fade: 1, timeout: 1800, timerId },
        topMenuVisibility
      );
      $("body>.ui.main.menu .launch").on("click", launch);
      topMenuVisibility({ data: { fade: 1, timeout: 1800, timerId } });
    }
    $("body>.ui.sidebar .ui.checkbox").checkbox("set unchecked");
    const hash = decodeURIComponent(window.location.pathname)
      .replace(/_/g, " ")
      .replace(/%2f/g, "/")
      .replace(/%2F/g, "/")
      .replace(/\/+/g, "/")
      .replace(/^\/+|\/+$/g, "");
    if (hash) {
      $(`body>.ui.sidebar .ui.checkbox[data-href="${hash}/"]`).each(
        updateSidebar
      );
    } else {
      first = $("body>.ui.sidebar>div.item:first>.title");
      first = first.length ? first : $("body>.ui.sidebar>a.item");
      $("body>.ui.main.menu>.header.item").html(first.text());
      $("body>.ui.sidebar.accordion").accordion("open", 0);
      $("body>.ui.sidebar .item[data-id]").attr("hidden", true);
      $("body>.ui.sidebar .item[data-id]:first").attr("hidden", false);
    }
  }
}
