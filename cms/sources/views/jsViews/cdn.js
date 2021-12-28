import { JetView } from "webix-jet";
import * as webix from "webix";

/**
 *
 */
export default class CdnView extends JetView {
  #config;

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      id: "cdn",
      view: "datatable",
      select: "row",
      columns: [
        {
          id: "url",
          editor: "text",
          header: "JS path",
          fillspace: true,
        },
      ],
      editable: true,
    };
  }

  /**
   *
   */
  config = () => this.#config;

  /**
   *
   */
  async init() {
    /**
     *
     */
    const onStoreUpdated = async () => {
      try {
        await this.app.io.putObject(
          "index.cdn.json",
          "application/json",
          webix.ajax().stringify($$("cdn").serialize())
        );
        webix.message("JS cdn list save complete");
      } catch (err) {
        webix.message({
          text: err.message,
          type: "error",
        });
      }
    };

    try {
      if ($$("sidebar").getSelectedId() === "js") {
        $$("cdn").clearAll();
        $$("cdn").parse(await this.app.io.getObject("index.cdn.json"));
        $$("cdn").data.attachEvent("onStoreUpdated", onStoreUpdated);
      }
    } catch (err) {
      webix.message({
        text: err.message,
        type: "error",
      });
    }
  }
}
