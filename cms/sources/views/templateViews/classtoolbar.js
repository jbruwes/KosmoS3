import { JetView } from "webix-jet";

export default class ClassToolbarView extends JetView {
  #config;

  constructor(app) {
    super(app);
    this.#config = {
      view: "toolbar",
      cols: [
        {
          view: "icon",
          icon: "mdi mdi-file-document-outline",
          click: () => {
            $$("class").select(
              $$("class").add({
                class: "",
              })
            );
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-delete-outline",
          click: () => {
            const id = $$("class").getSelectedId();
            if (id) {
              $$("class").editCancel();
              let newId = $$("class").getPrevId(id);
              if (!newId) newId = $$("class").getNextId(id);
              $$("class").remove(id);
              if (newId) $$("class").select(newId);
            }
          },
        },
        {},
      ],
    };
  }

  config() {
    return this.#config;
  }
}
