import { JetView } from "webix-jet";

/**
 *
 */
export default class ClassView extends JetView {
  /**
   *
   */
  config = () => ({
    id: "class",
    view: "datatable",
    select: "row",
    columns: [
      { id: "class", editor: "text", header: "class", fillspace: true },
    ],
    editable: true,
    on: {
      /**
       *
       */
      "data->onStoreUpdated": () =>
        this.getParentView().redraw(this.getParentView()),
    },
  });
}
