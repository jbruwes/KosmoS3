import $ from "jquery/dist/jquery.slim";
import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import { fabric } from "fabric";
import "../fabricjs";

/**
 * Класс редактора шаблона
 */
export default class TemplateView extends JetView {
  lockRedraw = false;

  /**
   * Деструктор
   */
  destroy() {
    fabric.util.removeListener(document.body, "wheel", this.wheelEvent);
  }

  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    id: "templateAccordion",
    view: "accordion",
    on: {
      /**
       * Обработчик скрытия табов
       *
       * @param {string} id Идентификатор таба
       */
      onAfterCollapse: (id) => {
        if (id === "tools") {
          $$("data").editCancel();
          $$("shadows").editCancel();
          $$("class").editCancel();
          switch ($$("tabbar").getValue()) {
            case "ace-template":
              $$("ace-template").getEditor().resize();
              break;
            case "fabricCnt":
              this.makeSelection();
              break;
            default:
          }
        }
      },
    },
    cols: [
      {
        view: "accordionitem",
        id: "templateItem",
        header: "<span class='mdi mdi-postage-stamp'></span>",
        body: {
          rows: [
            {
              id: "views",
              animate: false,
              keepViews: true,
              cells: [
                {
                  id: "fabricCnt",
                  rows: [
                    {
                      view: "toolbar",
                      cols: [
                        {
                          view: "icon",
                          icon: "mdi mdi-undo",
                          /**
                           * Обработчик отмены последнего действия
                           */
                          click: () => {
                            const pop = this.undo.pop();
                            if (pop) {
                              const fabricDocument = $(
                                $$("fabric").getIframe()
                              ).contents();
                              this.redo.push([
                                this.body.find("#body:first>.pusher").html(),
                                fabricDocument
                                  .find("body:first>.pusher")
                                  .html(),
                                webix
                                  .ajax()
                                  .stringify($$("fabric").getCanvas()),
                                $$("layers").serialize(),
                                $$("layers").getSelectedId(),
                              ]);
                              this.body
                                .find("#body:first>.pusher")
                                .html(pop[0]);
                              fabricDocument
                                .find("body:first>.pusher")
                                .html(pop[1]);
                              $$("fabric")
                                .getCanvas()
                                .loadFromJSON(
                                  pop[2],
                                  () =>
                                    $$("fabric").getCanvas().requestRenderAll(),
                                  (o, rect) => {
                                    const lRect = rect;
                                    lRect.toObject = (function pRectToObject(
                                      toObject
                                    ) {
                                      return function lRectToObject() {
                                        return fabric.util.object.extend(
                                          toObject.call(this),
                                          {
                                            id: this.id,
                                          }
                                        );
                                      };
                                    })(lRect.toObject);
                                  }
                                );
                              $$("layers").clearAll();
                              $$("layers").parse(pop[3]);
                              $$("layers").select(pop[4]);
                              this.save2();
                            }
                          },
                        },
                        {
                          view: "icon",
                          icon: "mdi mdi-redo",
                          /**
                           * Обработчик возврата отмененного действия
                           */
                          click: () => {
                            const pop = this.redo.pop();
                            if (pop) {
                              const fabricDocument = $(
                                $$("fabric").getIframe()
                              ).contents();
                              this.undo.push([
                                this.body.find("#body:first>.pusher").html(),
                                fabricDocument
                                  .find("body:first>.pusher")
                                  .html(),
                                webix
                                  .ajax()
                                  .stringify($$("fabric").getCanvas()),
                                $$("layers").serialize(),
                                $$("layers").getSelectedId(),
                              ]);
                              this.body
                                .find("#body:first>.pusher")
                                .html(pop[0]);
                              fabricDocument
                                .find("body:first>.pusher")
                                .html(pop[1]);
                              $$("fabric")
                                .getCanvas()
                                .loadFromJSON(
                                  pop[2],
                                  () =>
                                    $$("fabric").getCanvas().requestRenderAll(),
                                  (o, rect) => {
                                    const lRect = rect;
                                    lRect.toObject = (function pRectToObject(
                                      toObject
                                    ) {
                                      return function lRectToObject() {
                                        return fabric.util.object.extend(
                                          toObject.call(this),
                                          {
                                            id: this.id,
                                          }
                                        );
                                      };
                                    })(lRect.toObject);
                                  }
                                );
                              $$("layers").clearAll();
                              $$("layers").parse(pop[3]);
                              $$("layers").select(pop[4]);
                              this.save2();
                            }
                          },
                        },
                        {},
                      ],
                    },
                    {
                      id: "fabric",
                      view: "fabric",
                      canvas: "fabric",
                    },
                  ],
                },
                {
                  $subview: "tinymce",
                  id: "tinymce",
                },
                {
                  $subview: "ace",
                  id: "ace-template",
                },
              ],
            },
            {
              view: "tabbar",
              id: "tabbar",
              options: [
                {
                  value: "Layout",
                  id: "fabricCnt",
                  icon: "mdi mdi-ungroup",
                },
                {
                  value: "Visual",
                  id: "tinymce",
                  icon: "mdi mdi-eye-outline",
                },
                {
                  value: "Source",
                  id: "ace-template",
                  icon: "mdi mdi-code-tags",
                },
              ],
              multiview: "true",
              type: "bottom",
              on: {
                /**
                 * Обработчик переключения режимов редактора шаблонов
                 */
                onChange: () => {
                  switch ($$("tabbar").getValue()) {
                    case "ace-template":
                      $$("ace-template").$scope.setValue(
                        $$("tinymce").getValue()
                      );
                      break;
                    case "fabricCnt":
                      this.makeSelection();
                      break;
                    default:
                  }
                },
              },
            },
          ],
        },
      },
      {
        view: "accordionitem",
        collapsed: true,
        id: "tools",
        header: "<span class='mdi mdi-wrench-outline'></span> Tools",
        body: {
          id: "accordionRight",
          view: "accordion",
          type: "line",
          rows: [
            {
              view: "accordionitem",
              header: "<span class='mdi mdi-layers-outline'></span> Layers",
              body: {
                rows: [
                  {
                    $subview: "templateViews.layerstoolbar",
                  },
                  {
                    $subview: "templateViews.layers",
                    name: "templateViewsLayers",
                  },
                ],
              },
            },
            {
              view: "accordionitem",
              header: "<span class='mdi mdi-move-resize'></span> Geometry",
              collapsed: true,
              body: {
                $subview: "templateViews.geometry",
              },
            },
            {
              view: "accordionitem",
              collapsed: true,
              header: "<span class='mdi mdi-format-paint'></span> Appearance",
              body: {
                $subview: "templateViews.appearance",
              },
            },
            {
              view: "accordionitem",
              collapsed: true,
              header: "<span class='mdi mdi-box-shadow'></span> Shadow",
              body: {
                rows: [
                  {
                    $subview: "templateViews.shadowstoolbar",
                  },
                  {
                    $subview: "templateViews.shadows",
                  },
                ],
              },
            },
            {
              view: "accordionitem",
              collapsed: true,
              header: "<span class='mdi mdi-database'></span> Data",
              body: {
                rows: [
                  {
                    $subview: "templateViews.datatoolbar",
                  },
                  {
                    $subview: "templateViews.data",
                  },
                ],
              },
            },
            {
              view: "accordionitem",
              collapsed: true,
              header: "<span class='mdi mdi-language-css3'></span> Class",
              body: {
                rows: [
                  {
                    $subview: "templateViews.classtoolbar",
                  },
                  {
                    $subview: "templateViews.class",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });

  /**
   * Обработчик по готовности представления редактора шаблонов
   */
  async ready() {
    /**
     * Вычисление режима объекта
     *
     * @param {object} item Объект для расчета
     * @returns {number} Режим объекта
     */
    function getMode(item) {
      if (item.parent("div[data-absolute]:not([id])").parent(".pusher").length)
        return 1;
      if (item.parent("div[data-fixed]:not([id])").parent(".pusher").length)
        return 2;
      return 3;
    }
    $('[view_id="tinymce"]').css("display", "none"); // хак: потому что у subview не выставляется display:none в tabbar
    $('[view_id="fabric"]').css("position", "absolute");
    this.undo = [];
    this.redo = [];
    $$("fabric").attachEvent("onAfterLoad", () => {
      $$("fabric")
        .getCanvas(true)
        .then((canvas) => {
          canvas.setWidth(
            $$("fabric").getWindow().document.documentElement.clientWidth
          );
          canvas.setHeight(
            $$("fabric").getWindow().document.documentElement.clientHeight
          );
          $($$("fabric").getWindow()).scroll(this.makeSelection);
          $($$("fabric").getWindow()).resize(this.makeSelection);
          const observer = new MutationObserver(this.makeSelection);
          observer.observe($$("fabric").getWindow().document.body, {
            // 'attributes': true, // подвисает на сложных сайтах, падлюка
            childList: true,
            characterData: true,
            subtree: true,
          });
          $$("layers").select($$("layers").getFirstId());
        });
    });
    if ($$("sidebar").getSelectedId() === "template") {
      this.body = $("<div/>").append(
        $("<div/>")
          .attr("id", "body")
          .html(await this.app.io.getObject("index.htm"))
      );
      let pusher = this.body.find("#body:first>.pusher");
      if (!pusher.length)
        pusher = $("<div/>")
          .addClass("pusher")
          .append(this.body.find("#body:first").html());

      this.body.find("#body:first").empty().append(pusher);
      const list = this.body
        .find(
          "#body:first>.pusher>div[data-fixed]:not([id])>div[id],#body:first>.pusher>div[data-absolute]:not([id])>div[id],#body:first>.pusher>div[data-static]:not([id])>div[id]"
        )
        .not('div[id=""]');
      pusher = $("<div/>").addClass("pusher");
      list.each((index, element) =>
        pusher.append($(element).parentsUntil(".pusher").clone())
      );
      let o = pusher.find("#content");
      if (!o.length) {
        o = $('<div id="content"><main></main></div>');
        list.push(o[0]);
        pusher.append(o);
        o.wrap("<div data-static></div>");
      } else o.empty().append("<main></main>");
      this.body.find("#body:first").empty().append(pusher);
      list.sort((val1, val2) => {
        return (
          Math.abs($(val2).parent().css("z-index")) -
          Math.abs($(val1).parent().css("z-index"))
        );
      });
      list.each((i, e) => {
        let icon = "mdi mdi-monitor-off";
        switch (getMode($(e))) {
          case 1:
            icon = "mdi mdi-monitor-dashboard";
            break;
          case 2:
            icon = "mdi mdi-monitor-lock";
            break;
          case 3:
            icon = "mdi mdi-monitor-star";
            break;
          default:
        }
        $$("layers").add({
          id: webix.uid().toString(),
          value: $(e).attr("id"),
          markCheckbox: !$(e).parent().attr("hidden"),
          icon,
        });
      });
      const canvas = await $$("fabric").getCanvas(true);
      $$("layers")
        .serialize()
        .reverse()
        .forEach((value) => {
          const rect = new fabric.Rect({
            hasControls: value.markCheckbox,
            hasBorders: value.markCheckbox,
            opacity: 0,
            borderColor: "rgba(102,153,255,1)",
            cornerColor: "rgba(102,153,255,1)",
            cornerStyle: "circle",
            originX: "center",
            originY: "center",
            lockScalingFlip: true,
          });
          rect.toObject = (function pRectToObject(toObject) {
            return function lRectToObject() {
              return fabric.util.object.extend(toObject.call(this), {
                id: this.id,
              });
            };
          })(rect.toObject);
          canvas.add(rect);
          rect.id = value.id;
        });
      canvas.on("selection:updated", (options) => {
        $$("layers").select(options.selected[0].id);
      });
      canvas.on("selection:cleared", (options) => {
        if (options.deselected !== undefined)
          canvas.setActiveObject(options.deselected[0]);
      });
      canvas.on("object:modified", (options) => {
        this.updateDND(
          {
            top: this.top,
            left: this.left,
            angle: this.angle,
            oCoords: this.oCoords,
          },
          {
            top: options.target.top,
            left: options.target.left,
            angle: options.target.angle,
            oCoords: options.target.oCoords,
          }
        );
        this.redraw();
      });
      fabric.util.addListener(document.body, "keydown", (options) => {
        const key = options.which || options.keyCode;
        const activeObject = canvas.getActiveObject();
        if (options.target === document.body && activeObject) {
          switch (key) {
            case 38:
              activeObject.top -= 1;
              if (options.shiftKey) {
                if (options.altKey) activeObject.height -= 2;
                else activeObject.height += 2;
              }
              activeObject.setCoords();
              canvas.requestRenderAll();
              canvas.trigger("object:modified", {
                target: activeObject,
              });
              break;
            case 40:
              activeObject.top += 1;
              if (options.shiftKey) {
                if (options.altKey) activeObject.height -= 2;
                else activeObject.height += 2;
              }
              activeObject.setCoords();
              canvas.requestRenderAll();
              canvas.trigger("object:modified", {
                target: activeObject,
              });
              break;
            case 37:
              activeObject.left -= 1;
              if (options.shiftKey) {
                if (options.altKey) activeObject.width -= 2;
                else activeObject.width += 2;
              }
              activeObject.setCoords();
              canvas.requestRenderAll();
              canvas.trigger("object:modified", {
                target: activeObject,
              });
              break;
            case 39:
              activeObject.left += 1;
              if (options.shiftKey) {
                if (options.altKey) activeObject.width -= 2;
                else activeObject.width += 2;
              }
              activeObject.setCoords();
              canvas.requestRenderAll();
              canvas.trigger("object:modified", {
                target: activeObject,
              });
              break;
            default:
          }
        }
      });
      // stackoverflow.com/questions/41592349/allow-pointer-click-events-to-pass-through-element-whilst-maintaining-scroll-f
      fabric.util.addListener(document.body, "wheel", this.wheelEvent);
      this.loadSite();
    }
  }

  /**
   * Обработчик прокрутки колеса мыши
   *
   * @param {object} event Событие прокрутки колеса мышки
   */
  wheelEvent = (event) => {
    const scrollable =
      this.$$("fabric").getIframe().contentDocument.documentElement;
    switch (event.deltaMode) {
      case 0: // DOM_DELTA_PIXEL		Chrome
        scrollable.scrollTop += event.deltaY;
        scrollable.scrollLeft += event.deltaX;
        break;
      case 1: // DOM_DELTA_LINE		Firefox
        scrollable.scrollTop += 15 * event.deltaY;
        scrollable.scrollLeft += 15 * event.deltaX;
        break;
      case 2: // DOM_DELTA_PAGE
        scrollable.scrollTop += 0.03 * event.deltaY;
        scrollable.scrollLeft += 0.03 * event.deltaX;
        break;
      default:
    }
  };

  /**
   * Загрузчик шаблона сайта в iframe
   */
  async loadSite() {
    if (this.app && this.app.io) {
      const { document } = $$("fabric").getWindow();
      document.open();
      document.write(
        (await (await fetch("index.htm")).text())
          .replace(
            /{{ base }}/g,
            `${this.app.io.getWendpoint()}/${this.app.io.getBucket()}/`
          )
          .replace("{{ pusher }}", this.genHtml())
          .replace(/<script id="yandex"[^>]*>([\s\S]*?)<\/script>/gi, "")
          .replace(/<script id="google"[^>]*>([\s\S]*?)<\/script>/gi, "")
      );
      document.close();
    }
  }

  /**
   * Генератор html
   *
   * @returns {string} HTML
   */
  genHtml() {
    return this.body
      .find("#body:first>.pusher")
      .html()
      .replace(
        new RegExp(
          `${window.location.protocol}//${window.location.host}${window.location.pathname}`.replace(
            /[^/]*$/,
            ""
          ),
          "g"
        ),
        ""
      )
      .replace(/>(\s{1,}|\t{1,}|[\n\r]{1,})</gm, "><")
      .replace(/^\s*$[\n\r]{1,}/gm, "");
  }

  /**
   * Сортировка слоев по оси z
   *
   * @param {object} body Объект DOM
   * @param {string} prefix Селектор
   */
  zIndex = (body, prefix) => {
    const that = this.getSubView("templateViewsLayers");
    let i = that.$$("layers").count();
    that
      .$$("layers")
      .serialize()
      .forEach((value) => {
        body.find(`#${value.value}`).parent().css("z-index", i);
        i -= 1;
      });
    body.find(`${prefix}body:first>.pusher`).append(
      body
        .find(
          `${prefix}body:first>.pusher>div[data-fixed]:not([id]),${prefix}body:first>.pusher>div[data-absolute]:not([id]),${prefix}body:first>.pusher>div[data-static]:not([id])`
        )
        .sort((a, b) => {
          return Math.abs($(b).css("z-index")) - Math.abs($(a).css("z-index"));
        })
    );
  };

  /**
   * Отрисовка
   * 
   * @param {boolean} layers
   */
  redraw(layers) {
    /**
     * @param {object} item current object
     * @param {string} body body selector
     * @param {object} object object to save
     */
    function saveStage(item, body, object) {
      item.attr("style", "");
      const fixed = Number($$("mode").getValue());
      const dock = $$("dock").getValue() - 1;
      const hidden = item.parent().attr("hidden");
      object.find(body).append(item);
      if (dock) {
        switch (fixed) {
          case 1:
            item.wrap('<div data-absolute class="ui fluid container">');
            break;
          case 2:
            item.wrap('<div data-fixed class="ui fluid container">');
            break;
          case 3:
            item.wrap('<div data-static class="ui fluid container">');
            break;
          default:
        }
      } else {
        switch (fixed) {
          case 1:
            item.wrap('<div data-absolute class="ui container">');
            break;
          case 2:
            item.wrap('<div data-fixed class="ui container">');
            break;
          case 3:
            item.wrap('<div data-static class="ui container">');
            break;
          default:
        }
      }
      item.parent().attr("hidden", hidden);
      object.find(`${body}>div:not([id]):empty`).remove();
      const marginLeft = $$("marginLeft").getValue();
      const width = $$("width").getValue();
      const marginRight = $$("marginRight").getValue();
      const pmarginLeft = $$("pmarginLeft").getValue();
      const pmarginRight = $$("pmarginRight").getValue();
      const pwidth = $$("pwidth").getValue();
      // pmarginRight = pmarginRight === '%' ? 'vw' : pmarginRight;
      // pmarginLeft = pmarginLeft === '%' ? 'vw' : pmarginLeft;
      // pwidth = pwidth === '%' ? 'vw' : pwidth;
      if (marginLeft !== "") item.css("margin-left", marginLeft + pmarginLeft);
      if (marginRight !== "")
        item.css("margin-right", marginRight + pmarginRight);
      if (width !== "") item.css("min-width", width + pwidth);
      if (!(marginLeft !== "" && marginRight !== "")) {
        item.css("align-self", "center").css("-ms-flex-item-align", "center");
      }
      const marginTop = $$("marginTop").getValue();
      const height = $$("height").getValue();
      const marginBottom = $$("marginBottom").getValue();
      let pmarginTop = $$("pmarginTop").getValue();
      let pmarginBottom = $$("pmarginBottom").getValue();
      let pheight = $$("pheight").getValue();
      pmarginTop = pmarginTop === "%" ? "vh" : pmarginTop;
      pmarginBottom = pmarginBottom === "%" ? "vh" : pmarginBottom;
      pheight = pheight === "%" ? "vh" : pheight;
      if (marginTop !== "") item.css("margin-top", marginTop + pmarginTop);
      if (marginBottom !== "")
        item.css("margin-bottom", marginBottom + pmarginBottom);
      if (height !== "") item.css("min-height", height + pheight);
      if (marginTop !== "" && marginBottom !== "") item.css("flex", "1 1 auto");
      const angle = $$("angle").getValue();
      if (angle) item.css("transform", `rotate(${angle}deg)`);
      const paddingLeft = $$("paddingLeft").getValue();
      if (paddingLeft !== "") item.css("padding-left", `${paddingLeft}px`);
      const paddingRight = $$("paddingRight").getValue();
      if (paddingRight !== "") item.css("padding-right", `${paddingRight}px`);
      const paddingTop = $$("paddingTop").getValue();
      if (paddingTop !== "") item.css("padding-top", `${paddingTop}px`);
      const paddingBottom = $$("paddingBottom").getValue();
      if (paddingBottom !== "")
        item.css("padding-bottom", `${paddingBottom}px`);
      const borderLeftWidth = $$("borderLeftWidth").getValue();
      if (borderLeftWidth !== "")
        item.css("border-left-width", `${borderLeftWidth}px`);
      const borderRightWidth = $$("borderRightWidth").getValue();
      if (borderRightWidth !== "")
        item.css("border-right-width", `${borderRightWidth}px`);
      const borderTopWidth = $$("borderTopWidth").getValue();
      if (borderTopWidth !== "")
        item.css("border-top-width", `${borderTopWidth}px`);
      const borderBottomWidth = $$("borderBottomWidth").getValue();
      if (borderBottomWidth !== "")
        item.css("border-bottom-width", `${borderBottomWidth}px`);
      item.css("border-left-style", $$("borderLeftStyle").getValue());
      item.css("border-right-style", $$("borderRightStyle").getValue());
      item.css("border-top-style", $$("borderTopStyle").getValue());
      item.css("border-bottom-style", $$("borderBottomStyle").getValue());
      const borderLeftColor = $$("borderLeftColor").getValue();
      if (borderLeftColor !== "") {
        item.css(
          "border-left-color",
          borderLeftColor +
            webix.color.toHex(
              Math.round(2.55 * $$("borderLeftTransparency").getValue()),
              2
            )
        );
      }
      const borderRightColor = $$("borderRightColor").getValue();
      if (borderRightColor !== "") {
        item.css(
          "border-right-color",
          borderRightColor +
            webix.color.toHex(
              Math.round(2.55 * $$("borderRightTransparency").getValue()),
              2
            )
        );
      }
      const borderTopColor = $$("borderTopColor").getValue();
      if (borderTopColor !== "") {
        item.css(
          "border-top-color",
          borderTopColor +
            webix.color.toHex(
              Math.round(2.55 * $$("borderTopTransparency").getValue()),
              2
            )
        );
      }
      const borderBottomColor = $$("borderBottomColor").getValue();
      if (borderBottomColor !== "") {
        item.css(
          "border-bottom-color",
          borderBottomColor +
            webix.color.toHex(
              Math.round(2.55 * $$("borderBottomTransparency").getValue()),
              2
            )
        );
      }
      const borderTopLeftRadius = $$("borderTopLeftRadius").getValue();
      if (borderTopLeftRadius !== "") {
        item.css("border-top-left-radius", `${borderTopLeftRadius}px`);
      }
      const borderTopRightRadius = $$("borderTopRightRadius").getValue();
      if (borderTopRightRadius !== "") {
        item.css("border-top-right-radius", `${borderTopRightRadius}px`);
      }
      const borderBottomLeftRadius = $$("borderBottomLeftRadius").getValue();
      if (borderBottomLeftRadius !== "") {
        item.css("border-bottom-left-radius", `${borderBottomLeftRadius}px`);
      }
      const borderBottomRightRadius = $$("borderBottomRightRadius").getValue();
      if (borderBottomRightRadius !== "") {
        item.css("border-bottom-right-radius", `${borderBottomRightRadius}px`);
      }
      const textColor = $$("textColor").getValue();
      if (textColor !== "") {
        item.css(
          "color",
          textColor +
            webix.color.toHex(
              Math.round(2.55 * $$("textTransparency").getValue()),
              2
            )
        );
      }
      item.css("opacity", $$("transparency").getValue() / 100);
      const backgroundColor = $$("backgroundColor").getValue();
      if (backgroundColor !== "") {
        item.css(
          "background-color",
          backgroundColor +
            webix.color.toHex(
              Math.round(2.55 * $$("backgroundTransparency").getValue()),
              2
            )
        );
      }
      item.css("background-position", $$("backgroundPosition").getValue());
      item.css(
        "background-repeat",
        `${$$("repeat-x").getValue()} ${$$("repeat-y").getValue()}`
      );
      item.css("background-attachment", $$("attachment").getValue());
      item.css("background-size", $$("backgroundSize").getValue());
      const shadows = [];
      $$("shadows")
        .serialize()
        .forEach((value) =>
          shadows.push(
            `${(value.inset ? "inset " : "") + Number(value.x)}px ${Number(
              value.y
            )}px ${Number(value.blur)}px ${Number(value.spread)}px ${
              value.color
            }`
          )
        );
      item.css("box-shadow", shadows.join());
      const classes = [];
      $$("class")
        .serialize()
        .forEach((value) => classes.push(value.class));
      item.removeClass().addClass(classes.join(" "));
      $.each(item.data(), (i) =>
        item.removeAttr(`data-${i.replace(/[A-Z]/g, "-$&").toLowerCase()}`)
      );
      $$("data")
        .serialize()
        .forEach((value) => {
          if (value.data) {
            item
              .data(
                value.data
                  .toLowerCase()
                  .replace(/-([a-z])/g, function valueDataToUpperCase(g) {
                    return g[1].toUpperCase();
                  }),
                value.value
              )
              .attr(`data-${value.data.toLowerCase()}`, value.value);
          }
        });
      const backgroundImage = $$("bglist").getItem($$("bglist").getFirstId());
      if (backgroundImage && backgroundImage.file.sname) {
        item.css("background-image", `url("${backgroundImage.file.sname}")`);
      }
    }

    if (!this.lockRedraw && this.body) {
      const fabricDocument = $($$("fabric").getIframe()).contents();
      const item = $$("layers").getSelectedItem();
      if (item) {
        if (!layers) {
          this.redo = [];
          this.undo.push([
            this.body.find("#body:first>.pusher").html(),
            fabricDocument.find("body:first>.pusher").html(),
            webix.ajax().stringify($$("fabric").getCanvas()),
            $$("layers").serialize(),
            $$("layers").getSelectedId(),
          ]);
        }
        saveStage(
          this.body.find(`#${item.value}`),
          "#body:first>.pusher",
          this.body
        );
        this.zIndex(this.body, "#");
        saveStage(
          fabricDocument.find(`#${item.value}`),
          "body:first>.pusher",
          fabricDocument
        );
        this.zIndex(fabricDocument, "");
        // this.genHtml();
        this.save2();
      }
    }
  }

  /**
   *
   */
  async save() {
    const fabricDocument = $($$("fabric").getIframe()).contents();
    const item = $$("layers").getSelectedItem();
    if (item) {
      await $$("tinymce").getEditor(true);
      this.body.find(`#${item.value}`).html($$("tinymce").getValue());
      fabricDocument.find(`#${item.value}`).html($$("tinymce").getValue());
      // this.genHtml();
      this.save2();
    }
  }

  /**
   *
   */
  async save2() {
    try {
      await this.app.io.putObject("index.htm", "text/html", this.genHtml());
      webix.message("Template save complete");
      if (this.siteWorker) this.siteWorker.terminate();
      this.siteWorker = new Worker(
        new URL("../workers/site.js", import.meta.url)
      );
      this.siteWorker.postMessage({
        pAccessKeyId: this.app.io.getAccessKeyId(),
        pSecretAccessKey: this.app.io.getSecretAccessKey(),
        pBucketName: this.app.io.getBucket(),
        pRegion: this.app.io.getRegion(),
        pEndpoint: this.app.io.getEndpoint(),
      });
    } catch (err) {
      webix.message({
        text: err.message,
        type: "error",
      });
    }
  }

  /**
   * @param oldRect
   * @param newRect
   */
  updateDND(oldRect, newRect) {
    this.lockRedraw = true;
    let deltaAngle = oldRect.angle - newRect.angle;
    if (deltaAngle !== 0) {
      deltaAngle = Math.round($$("angle").getValue() - deltaAngle);
      if (deltaAngle > 180) {
        deltaAngle -= 360;
      }
      $$("angle").setValue(deltaAngle);
    } else {
      const oldOrigin = new fabric.Point(oldRect.left, oldRect.top);
      const newOrigin = new fabric.Point(newRect.left, newRect.top);
      const angle = -fabric.util.degreesToRadians(newRect.angle);
      const oldTr = fabric.util.rotatePoint(
        oldRect.oCoords.tr,
        oldOrigin,
        angle
      );
      const newTr = fabric.util.rotatePoint(
        newRect.oCoords.tr,
        newOrigin,
        angle
      );
      const oldBr = fabric.util.rotatePoint(
        oldRect.oCoords.br,
        oldOrigin,
        angle
      );
      const newBr = fabric.util.rotatePoint(
        newRect.oCoords.br,
        newOrigin,
        angle
      );
      const oldTl = fabric.util.rotatePoint(
        oldRect.oCoords.tl,
        oldOrigin,
        angle
      );
      const newTl = fabric.util.rotatePoint(
        newRect.oCoords.tl,
        newOrigin,
        angle
      );
      const delta = {
        top: newTr.y - oldTr.y,
        bottom: newBr.y - oldBr.y,
        left: newTl.x - oldTl.x,
        right: newTr.x - oldTr.x,
      };
      const fabricDocument = $($$("fabric").getIframe()).contents();
      const dX = 100 / fabricDocument[0].body.scrollWidth;
      const dY = 100 / fabricDocument[0].body.scrollHeight;
      const marginTop = $$("marginTop").getValue();
      const pmarginTop = $$("pmarginTop").getValue();
      if (marginTop !== "") {
        $$("marginTop").setValue(
          Math.round(
            Number(marginTop) + (pmarginTop === "%" ? dY : 1) * delta.top
          )
        );
      }
      const marginBottom = $$("marginBottom").getValue();
      const pmarginBottom = $$("pmarginBottom").getValue();
      if (marginBottom !== "") {
        $$("marginBottom").setValue(
          Math.round(
            Number(marginBottom) -
              (pmarginBottom === "%" ? dY : 1) * delta.bottom
          )
        );
      }
      const height = $$("height").getValue();
      const pheight = $$("pheight").getValue();
      if ((marginTop === "" || marginBottom === "") && height !== "") {
        $$("height").setValue(
          Math.round(
            Number(height) -
              (pheight === "%" ? dY : 1) * (delta.top - delta.bottom)
          )
        );
      }
      const marginLeft = $$("marginLeft").getValue();
      const pmarginLeft = $$("pmarginLeft").getValue();
      if (marginLeft !== "") {
        $$("marginLeft").setValue(
          Math.round(
            Number(marginLeft) + (pmarginLeft === "%" ? dX : 1) * delta.left
          )
        );
      }
      const marginRight = $$("marginRight").getValue();
      const pmarginRight = $$("pmarginRight").getValue();
      if (marginRight !== "") {
        $$("marginRight").setValue(
          Math.round(
            Number(marginRight) - (pmarginRight === "%" ? dX : 1) * delta.right
          )
        );
      }
      const width = $$("width").getValue();
      const pwidth = $$("pwidth").getValue();
      if ((marginLeft === "" || marginRight === "") && width !== "") {
        $$("width").setValue(
          Math.round(
            Number(width) -
              (pwidth === "%" ? dX : 1) * (delta.left - delta.right)
          )
        );
      }
    }
    this.lockRedraw = false;
  }

  /**
   *
   */
  makeSelection = () => {
    let selectedItem = null;

    /**
     * @param {*} pElem Элемент
     * @param {*} options Свойства
     * @param {*} callback Коллбэк
     * @param {*} args Аргументы
     * @returns {*} Возврат свапа
     */
    function swap(pElem, options, callback, args) {
      const elem = pElem;
      const old = {};
      Object.keys(options).forEach((name) => {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      });
      const ret = callback.call(elem, args);
      Object.keys(options).forEach((name) => {
        elem.style[name] = old[name];
      });
      return ret;
    }

    /**
     * @param {*} pThose Те объекты
     * @param that
     * @param pThat
     */
    function doLayers(pThat) {
      const that = pThat;
      let layer = null;
      let map = null;
      let selObj = null;
      let style = null;
      const fabricDocument = $($$("fabric").getIframe()).contents();
      const selectedId = $$("layers").getSelectedId();
      let selectedRect = null;
      $$("fabric")
        .getCanvas()
        .forEachObject((rect) => {
          layer = $$("layers").getItem(rect.id);
          selObj = fabricDocument.find(`#${layer.value}`);
          if (selObj.length) {
            if (selObj.parent().attr("hidden")) {
              rect.set({
                hasBorders: false,
                hasControls: false,
                selectable: false,
                evented: false,
              });
            } else {
              map = selObj[0].getBoundingClientRect();
              style = selObj.attr("style") || "";
              rect.set({
                left: Math.round((map.right + map.left) / 2),
                top: Math.round((map.bottom + map.top) / 2),
                width: selObj.outerWidth(),
                height: selObj.outerHeight(),
                scaleX: 1,
                scaleY: 1,
                angle: +(style.match(/rotate\(-?\d+deg\)/g) || ["0"])[0]
                  .replace("rotate(", "")
                  .replace("deg)", ""),
                hasBorders: true,
                hasControls: true,
                selectable: true,
                evented: true,
              });
              rect.moveTo(Math.abs(selObj.parent().css("z-index")) - 1);
              layer.left = rect.left;
              layer.top = rect.top;
              layer.angle = rect.angle;
            }
          } else {
            rect.set({
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              scaleX: 1,
              scaleY: 1,
              angle: 0,
            });
          }
          rect.setCoords();
          if (rect.id && rect.id === selectedId) {
            selectedRect = rect;
            $$("fabric").getCanvas().setActiveObject(rect);
            that.oCoords = rect.oCoords;
            that.top = rect.top;
            that.left = rect.left;
            that.angle = rect.angle;
          }
        });
      if (selectedRect) $$("fabric").getCanvas().bringToFront(selectedRect);
      $$("fabric").getCanvas().requestRenderAll();
    }
    if (
      ($$("tools").config.collapsed &&
        $$("tabbar").getValue() === "fabricCnt") ||
      !$$("tools").config.collapsed
    ) {
      const isHidden = $($$("fabric").getIframe()).parent(":hidden");
      selectedItem = $$("layers").getSelectedItem();
      $$("templateItem").define(
        "header",
        `<span class='mdi mdi-postage-stamp'></span> ${selectedItem.value}`
      );
      $$("templateItem").refresh();
      if (isHidden.length) {
        swap(
          isHidden[isHidden.length - 1],
          {
            position: "absolute",
            visibility: "hidden",
            display: "block",
          },
          doLayers,
          this
        );
      } else doLayers(this);
    }
    return selectedItem;
  };

  /**
   * @param selectedItem
   */
  setParams(selectedItem) {
    /**
     * Given an item, return the mode of the item
     *
     * @param item - The element that is being scrolled.
     * @returns The mode of the item.
     */
    function getMode(item) {
      if (item.parent("div[data-absolute]:not([id])").parent(".pusher").length)
        return 1;
      if (item.parent("div[data-fixed]:not([id])").parent(".pusher").length)
        return 2;
      return 3;
    }

    const item = this.body.find(`#${selectedItem.value}`);
    if (item.length) {
      this.lockRedraw = true;
      if (selectedItem.value === "content") {
        $$("tinymce").disable();
        $$("tinymce").$scope.setValue("");
        $$("ace-template").disable();
        $$("ace-template").$scope.setValue("");
      } else {
        $$("tinymce").enable();
        $$("tinymce").$scope.setValue(item.html());
        $$("ace-template").enable();
        $$("ace-template").$scope.setValue(item.html());
      }
      $$("mode").setValue(getMode(item));
      $$("dock").setValue(
        !item.parent("div.container:not(.fluid):not([id])").length + 1
      );
      $$("angle").setValue(
        ((item.attr("style") || "").match(/rotate\(-?\d+deg\)/g) || [""])[0]
          .replace("rotate(", "")
          .replace("deg)", "")
      );
      $$("paddingLeft").setValue(parseInt(item[0].style.paddingLeft, 10));
      $$("paddingRight").setValue(parseInt(item[0].style.paddingRight, 10));
      $$("paddingTop").setValue(parseInt(item[0].style.paddingTop, 10));
      $$("paddingBottom").setValue(parseInt(item[0].style.paddingBottom, 10));
      $$("borderLeftWidth").setValue(
        parseInt(item[0].style.borderLeftWidth, 10)
      );
      $$("borderRightWidth").setValue(
        parseInt(item[0].style.borderRightWidth, 10)
      );
      $$("borderTopWidth").setValue(parseInt(item[0].style.borderTopWidth, 10));
      $$("borderBottomWidth").setValue(
        parseInt(item[0].style.borderBottomWidth, 10)
      );
      $$("borderLeftStyle").setValue(
        item[0].style.borderLeftStyle ? item[0].style.borderLeftStyle : "none"
      );
      $$("borderRightStyle").setValue(
        item[0].style.borderRightStyle ? item[0].style.borderRightStyle : "none"
      );
      $$("borderTopStyle").setValue(
        item[0].style.borderTopStyle ? item[0].style.borderTopStyle : "none"
      );
      $$("borderBottomStyle").setValue(
        item[0].style.borderBottomStyle
          ? item[0].style.borderBottomStyle
          : "none"
      );
      $$("borderLeftColor").setValue(
        webix.color.rgbToHex(item[0].style.borderLeftColor)
      );
      $$("borderRightColor").setValue(
        webix.color.rgbToHex(item[0].style.borderRightColor)
      );
      $$("borderTopColor").setValue(
        webix.color.rgbToHex(item[0].style.borderTopColor)
      );
      $$("borderBottomColor").setValue(
        webix.color.rgbToHex(item[0].style.borderBottomColor)
      );
      $$("borderLeftTransparency").setValue(
        item[0].style.borderLeftColor.indexOf("rgba")
          ? 100
          : Math.round(
              100 * item[0].style.borderLeftColor.replace(/^.*,(.+)\)/, "$1")
            )
      );
      $$("borderRightTransparency").setValue(
        item[0].style.borderRightColor.indexOf("rgba")
          ? 100
          : Math.round(
              100 * item[0].style.borderRightColor.replace(/^.*,(.+)\)/, "$1")
            )
      );
      $$("borderTopTransparency").setValue(
        item[0].style.borderTopColor.indexOf("rgba")
          ? 100
          : Math.round(
              100 * item[0].style.borderTopColor.replace(/^.*,(.+)\)/, "$1")
            )
      );
      $$("borderBottomTransparency").setValue(
        item[0].style.borderBottomColor.indexOf("rgba")
          ? 100
          : Math.round(
              100 * item[0].style.borderBottomColor.replace(/^.*,(.+)\)/, "$1")
            )
      );
      const { marginTop } = item[0].style;
      const parseMarginTop = parseInt(marginTop, 10);
      $$("marginTop").setValue(parseMarginTop);
      if (parseMarginTop) {
        $$("pmarginTop").setValue(
          marginTop.match(/\D+$/)[0] === "px" ? "px" : "%"
        );
      } else $$("pmarginTop").setValue("px");
      const height = item[0].style.minHeight
        ? item[0].style.minHeight
        : item[0].style.height;
      const parseHeight = parseInt(height, 10);
      $$("height").setValue(parseHeight);
      if (parseHeight) {
        $$("pheight").setValue(height.match(/\D+$/)[0] === "px" ? "px" : "%");
      } else $$("pheight").setValue("px");
      const { marginBottom } = item[0].style;
      const parseMarginBottom = parseInt(marginBottom, 10);
      $$("marginBottom").setValue(parseMarginBottom);
      if (parseMarginBottom) {
        $$("pmarginBottom").setValue(
          marginBottom.match(/\D+$/)[0] === "px" ? "px" : "%"
        );
      } else $$("pmarginBottom").setValue("px");
      const { marginLeft } = item[0].style;
      const parseMarginLeft = parseInt(marginLeft, 10);
      $$("marginLeft").setValue(parseMarginLeft);
      if (parseMarginLeft) {
        $$("pmarginLeft").setValue(
          marginLeft.match(/\D+$/)[0] === "px" ? "px" : "%"
        );
      } else $$("pmarginLeft").setValue("px");
      const width = item[0].style.minWidth
        ? item[0].style.minWidth
        : item[0].style.width;
      const parseWidth = parseInt(width, 10);
      $$("width").setValue(parseWidth);
      if (parseWidth)
        $$("pwidth").setValue(width.match(/\D+$/)[0] === "px" ? "px" : "%");
      else $$("pwidth").setValue("px");
      const { marginRight } = item[0].style;
      const parseMarginRight = parseInt(marginRight, 10);
      $$("marginRight").setValue(parseMarginRight);
      if (parseMarginRight) {
        $$("pmarginRight").setValue(
          marginRight.match(/\D+$/)[0] === "px" ? "px" : "%"
        );
      } else $$("pmarginRight").setValue("px");
      $$("borderTopLeftRadius").setValue(
        parseInt(item[0].style.borderTopLeftRadius, 10)
      );
      $$("borderTopRightRadius").setValue(
        parseInt(item[0].style.borderTopRightRadius, 10)
      );
      $$("borderBottomLeftRadius").setValue(
        parseInt(item[0].style.borderBottomLeftRadius, 10)
      );
      $$("borderBottomRightRadius").setValue(
        parseInt(item[0].style.borderBottomRightRadius, 10)
      );
      $$("textColor").setValue(webix.color.rgbToHex(item[0].style.color));
      $$("textTransparency").setValue(
        item[0].style.color.indexOf("rgba")
          ? 100
          : Math.round(100 * item[0].style.color.replace(/^.*,(.+)\)/, "$1"))
      );
      let { backgroundImage } = item[0].style;
      backgroundImage = backgroundImage || "";
      backgroundImage =
        backgroundImage !== "" && backgroundImage !== "none"
          ? backgroundImage
              .replace("url(", "")
              .replace(")", "")
              .replace(/"/g, "")
              .replace(
                new RegExp(
                  `${window.location.protocol}//${window.location.host}${window.location.pathname}`.replace(
                    /[^/]*$/,
                    ""
                  ),
                  "g"
                ),
                ""
              )
          : "";
      $$("uploader").files.data.clearAll();
      if (backgroundImage) {
        $$("uploader").addFile(
          {
            name: backgroundImage.split("/").pop(),
            sname: backgroundImage,
          },
          0
        );
      }
      $$("backgroundPosition").setValue(item[0].style.backgroundPosition);
      if (!$$("backgroundPosition").getValue()) {
        $$("backgroundPosition").setValue("0% 0%");
      }
      let backgroundRepeat = item[0].style.backgroundRepeat
        ? item[0].style.backgroundRepeat
        : "repeat";
      if (backgroundRepeat === "repeat-x")
        backgroundRepeat = "repeat no-repeat";
      if (backgroundRepeat === "repeat-y")
        backgroundRepeat = "no-repeat repeat";
      backgroundRepeat = backgroundRepeat.split(" ");
      $$("repeat-x").setValue(backgroundRepeat[0]);
      $$("repeat-y").setValue(backgroundRepeat[backgroundRepeat.length - 1]);
      $$("attachment").setValue(
        item[0].style.backgroundAttachment
          ? item[0].style.backgroundAttachment
          : "scroll"
      );
      $$("backgroundSize").setValue(
        item[0].style.backgroundSize ? item[0].style.backgroundSize : "auto"
      );
      $$("backgroundColor").setValue(
        webix.color.rgbToHex(item[0].style.backgroundColor)
      );
      $$("backgroundTransparency").setValue(
        item[0].style.backgroundColor.indexOf("rgba")
          ? 100
          : Math.round(
              100 * item[0].style.backgroundColor.replace(/^.*,(.+)\)/, "$1")
            )
      );
      const transparency = item[0].style.opacity;
      $$("transparency").setValue(
        transparency === "" ? 100 : Math.round(transparency * 100)
      );
      $$("shadows").clearAll();
      let { boxShadow } = item[0].style;
      boxShadow = boxShadow === "none" ? null : boxShadow;
      if (boxShadow) {
        boxShadow = boxShadow.split(/,(?![^(]*\))/);
        boxShadow.forEach((element) => {
          const cur = element.trim().split(/ (?![^(]*\))/g);
          const boxShadowGeom = cur.filter((val) => {
            return val.match(/^-?\d+/);
          });
          const boxShadowParams = cur.filter((val) => {
            return !val.match(/^-?\d+/);
          });
          let inset = null;
          let color = null;
          const [boxShadowParams0, boxShadowParams1] = boxShadowParams;
          if (boxShadowParams0) {
            switch (boxShadowParams0) {
              case "inset":
                inset = true;
                break;
              default:
                color = boxShadowParams0;
                break;
            }
          }
          if (boxShadowParams1) {
            switch (boxShadowParams1) {
              case "inset":
                inset = true;
                break;
              default:
                color = boxShadowParams1;
                break;
            }
          }
          $$("shadows").add({
            x: boxShadowGeom[0] ? parseFloat(boxShadowGeom[0]) : 0,
            y: boxShadowGeom[1] ? parseFloat(boxShadowGeom[1]) : 0,
            blur: boxShadowGeom[2] ? parseFloat(boxShadowGeom[2]) : 0,
            spread: boxShadowGeom[3] ? parseFloat(boxShadowGeom[3]) : 0,
            inset: inset || false,
            color: `#${webix.color.rgbToHex(color)}`,
          });
        });
        $$("shadows").select($$("shadows").getFirstId());
      }
      $$("data").clearAll();
      const data = item.data();
      Object.keys(data).forEach((x) => {
        if (Object.prototype.hasOwnProperty.call(data, x)) {
          $$("data").add({
            data: x.replace(/[A-Z]/g, "-$&").toLowerCase(),
            value: data[x],
          });
        }
      });
      if (data.length) $$("data").select($$("data").getFirstId());
      $$("class").clearAll();
      let classRow = item.attr("class");
      classRow = classRow ? classRow.split(/\s+/) : [];
      Object.keys(classRow).forEach((y) => {
        $$("class").add({
          class: classRow[y],
        });
      });
      if (classRow.length) $$("class").select($$("class").getFirstId());
      this.lockRedraw = false;
    }
  }
}
