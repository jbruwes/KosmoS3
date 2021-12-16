import $ from "jquery/dist/jquery.slim";
import { JetView } from "webix-jet";
import * as webix from "webix";
import { fabric } from "fabric";
import "../../fabricjs";

/**
 *
 */
export default class LayersToolbarView extends JetView {
  /**
   *
   */
  config = () => ({
    view: "toolbar",
    cols: [
      {
        view: "icon",
        icon: "mdi mdi-file-document-outline",
        /**
         *
         */
        click: () => {
          const id = webix.uid().toString();
          const that = this.getParentView();
          const fabricDocument = $($$("fabric").getIframe()).contents();
          this.undo();
          that.body
            .find("#body:first>.pusher")
            .append(
              $(
                `${'<div data-fixed><div id="layer-'}${id}" style=margin-left:0;margin-right:0;margin-top:0;height:100px;"></div></div>`
              )
            );
          that.zIndex.call(that, that.body, "#");
          fabricDocument
            .find("body:first>.pusher")
            .append(
              $(
                `${'<div data-fixed><div id="layer-'}${id}" style="margin-left:0;margin-right:0;margin-top:0;height:100px;"></div></div>`
              )
            );
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
         *
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
         *
         */
        click: () => {
          const item = $$("layers").getSelectedItem();
          const that = this.getParentView();
          const fabricDocument = $($$("fabric").getIframe()).contents();
          if (item) {
            if (item.value === "content")
              webix.message("Delete is prohibited", "debug");
            else {
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
          }
        },
      },
      {
        view: "icon",
        icon: "mdi mdi-arrow-up-bold-box-outline",
        /**
         *
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
         *
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
   *
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
