import { JetView } from "webix-jet";

/**
 *
 */
export default class DataToolbarView extends JetView {
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
            $$("data").select(
              $$("data").add({
                data: "",
                value: "",
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
            const id = $$("data").getSelectedId();
            if (id) {
              $$("data").editCancel();
              let newId = $$("data").getPrevId(id);
              if (!newId) newId = $$("data").getNextId(id);
              $$("data").remove(id);
              if (newId) $$("data").select(newId);
            }
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
