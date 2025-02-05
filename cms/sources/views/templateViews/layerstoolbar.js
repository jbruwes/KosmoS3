import $ from "jquery/dist/jquery.slim";
import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import { fabric } from "fabric";
import "../../fabricjs";

/**
 * Класс тулбара для слоёв
 */
export default class LayersToolbarView extends JetView {
  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    view: "toolbar",
    cols: [
      {
        view: "icon",
        icon: "mdi mdi-file-document-outline",
        /**
         * Добавить слой
         */
        click: () => {
          const id = webix.uid().toString();
          const that = this.getParentView();
          const fabricDocument = $($$("fabric").getIframe()).contents();
          const layer = `<div class="ui container" data-static><div id="layer-${id}" class="ui raised segment" style="margin:10px 0;"><div class="ui fluid placeholder"><div class="image header"><div class="line"></div><div class="line"></div></div><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div></div>`;
          this.undo();
          that.body.find("#body:first>.pusher").append($(layer));
          that.zIndex.call(that, that.body, "#");
          fabricDocument.find("body:first>.pusher").append($(layer));
          that.zIndex.call(that, fabricDocument, "");
          $$("layers").add({
            id,
            value: `layer-${id}`,
            markCheckbox: true,
            icon: "mdi mdi-monitor-lock",
          });
          const rect = new fabric.Rect({
            hasControls: true,
            hasBorders: true,
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
          $$("fabric").getCanvas().add(rect);
          rect.id = id;
          $$("layers").select(id);
          $$("layers").edit(id);
        },
      },
      {
        view: "icon",
        icon: "mdi mdi-pencil",
        /**
         * Переименовать слой
         */
        click: () => {
          const id = $$("layers").getSelectedId();
          if (id) {
            this.undo();
            $$("layers").edit(id);
          }
        },
      },
      {
        view: "icon",
        icon: "mdi mdi-delete-outline",
        /**
         * Удалить слой
         */
        click: () => {
          const item = $$("layers").getSelectedItem();
          const that = this.getParentView();
          const fabricDocument = $($$("fabric").getIframe()).contents();
          if (item) {
            if (item.value === "content")
              webix.message("Delete is prohibited", "debug");
            else
              webix.confirm("Are you sure?", (result) => {
                if (result) {
                  this.undo();
                  let newId = $$("layers").getPrevId(item.id);
                  if (!newId) newId = $$("layers").getNextId(item.id);
                  that.body.find(`#${item.value}`).remove();
                  that.body
                    .find("#body:first>.pusher>div:not([id]):empty")
                    .remove();
                  that.zIndex.call(that, that.body, "#");
                  fabricDocument.find(`#${item.value}`).remove();
                  fabricDocument
                    .find("body:first>.pusher>div:not([id]):empty")
                    .remove();
                  that.zIndex.call(that, fabricDocument, "");
                  if (newId) $$("layers").select(newId);
                  $$("fabric")
                    .getCanvas()
                    .forEachObject((obj) => {
                      if (obj.id && obj.id === item.id)
                        $$("fabric").getCanvas().remove(obj);
                    });
                  $$("layers").remove(item.id);
                }
              });
          }
        },
      },
      {
        view: "icon",
        icon: "mdi mdi-arrow-up-bold-box-outline",
        /**
         * Слой вверх
         */
        click: () => {
          const id = $$("layers").getSelectedId();
          if (id) {
            this.undo();
            $$("layers").moveUp(id);
          }
        },
      },
      {
        view: "icon",
        icon: "mdi mdi-arrow-down-bold-box-outline",
        /**
         * Слой вниз
         */
        click: () => {
          const id = $$("layers").getSelectedId();
          if (id) {
            this.undo();
            $$("layers").moveDown(id);
          }
        },
      },
      {},
    ],
  });

  /**
   * Отмена последнего действия
   */
  undo() {
    const that = this.getParentView();
    const fabricDocument = $($$("fabric").getIframe()).contents();
    that.redo = [];
    that.undo.push([
      that.body.find("#body:first>.pusher").html(),
      fabricDocument.find("body:first>.pusher").html(),
      webix.ajax().stringify($$("fabric").getCanvas()),
      $$("layers").serialize(),
      $$("layers").getSelectedId(),
    ]);
  }
}
