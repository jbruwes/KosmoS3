import { JetView } from "webix-jet";

/**
 *
 */
export default class ShadowToolbarView extends JetView {
  #config;

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      view: "toolbar",
      cols: [
        {
          view: "icon",
          icon: "mdi mdi-file-document-outline",
          /**
           *
           */
          click: () => {
            $$("shadows").select(
              $$("shadows").add({
                x: 0,
                y: 0,
                blur: 0,
                spread: 0,
                inset: false,
                color: "#000000",
              })
            );
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-delete-outline",
          /**
           *
           */
          click: () => {
            const id = $$("shadows").getSelectedId();
            if (id) {
              $$("shadows").editCancel();
              let newId = $$("shadows").getPrevId(id);
              if (!newId) newId = $$("shadows").getNextId(id);
              $$("shadows").remove(id);
              if (newId) $$("shadows").select(newId);
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
            const id = $$("shadows").getSelectedId();
            if (id) $$("shadows").moveUp(id);
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-arrow-down-bold-box-outline",
          /**
           *
           */
          click: () => {
            const id = $$("shadows").getSelectedId();
            if (id) $$("shadows").moveDown(id);
          },
        },
        {},
      ],
    };
  }

  /**
   *
   */
  config = () => this.#config;
}
