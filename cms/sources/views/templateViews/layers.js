import $ from "jquery/dist/jquery.slim";
import { JetView } from "webix-jet";
import * as webix from "webix";
import "../../editlist";
import "../../fabricjs";

/**
 *
 */
export default class LayersView extends JetView {
  /**
   *
   */
  config = () => ({
    view: "editlist",
    id: "layers",
    select: "row",
    editable: true,
    editaction: "dblclick",
    editor: "text",
    editValue: "value",
    type: {
      /**
       * @param obj
       */
      markCheckbox(obj) {
        return `<span class='check mdi mdi-18px mdi-checkbox-${
          obj.markCheckbox ? "marked-" : "blank-"
        }outline'></span>`;
      },
    },
    onClick: {
      /**
       * @param e
       * @param id
       */
      check: (e, id) => {
        const item = $$("layers").getItem(id);
        const item1 = this.getParentView().body.find(`#${item.value}`);
        const item2 = $($$("fabric").getIframe())
          .contents()
          .find(`#${item.value}`);
        item.markCheckbox = item.markCheckbox ? 0 : 1;
        if (item.markCheckbox) {
          item1.removeAttr("hidden");
          item2.removeAttr("hidden");
          item1.parent().removeAttr("hidden");
          item2.parent().removeAttr("hidden");
        } else {
          // item1.attr("hidden", "");
          // item2.attr("hidden", "");
          item1.parent().attr("hidden", "");
          item2.parent().attr("hidden", "");
        }
        $$("layers").updateItem(id, item);
      },
    },
    template:
      "<span class='mdi mdi-dark mdi-inactive mdi-18px mdi-#icon#'></span> {common.markCheckbox()} #value#",
    on: {
      /**
       *
       */
      onSelectChange: () => {
        const that = this.getParentView();
        const selectedItem = that.makeSelection.call(that);
        if (selectedItem) that.setParams.call(that, selectedItem);
      },
      /**
       *
       */
      "data->onStoreUpdated": () =>
        this.getParentView().redraw.call(this.getParentView(), true),
      /**
       * @param state
       * @param editor
       * @param ignore
       */
      onBeforeEditStop: (state, editor, ignore) => {
        const that = this.getParentView();
        const fabricDocument = $($$("fabric").getIframe()).contents();
        if (!(ignore && state.old)) {
          if (
            !state.value ||
            (state.old !== state.value &&
              that.body.find(`#${state.value}`).length !== 0)
          ) {
            webix.message(
              state.value ? "The id is already exists" : "Can't be empty",
              "debug"
            );
            return false;
          }
          if (!/^[A-Za-z][-A-Za-z0-9_]*$/.test(state.value)) {
            webix.message("Prohibited symbols are used", "debug");
            return false;
          }
          that.body.find(`#${state.old}`).attr("id", state.value);
          that.zIndex.call(that, that.body, "#");
          fabricDocument.find(`#${state.old}`).attr("id", state.value);
          that.zIndex.call(that, fabricDocument, "");
        }
        $$("templateItem").define(
          "header",
          `<span class='mdi mdi-postage-stamp'></span> ${state.value}`
        );
        $$("templateItem").refresh();
        return true;
      },
      /**
       * @param id
       */
      onBeforeEditStart: (id) => {
        if ($$("layers").getItem(id).value === "content") {
          webix.message("Rename is prohibited", "debug");
          return false;
        }
        return true;
      },
    },
  });
}
