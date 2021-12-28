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
          header: "CSS path",
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
      const url = [];
      $$("cdn")
        .serialize()
        .forEach((value) => url.push(`@import url(${value.url});`));
      try {
        await this.app.io.putObject(
          "index.cdn.css",
          "text/css",
          url.join("\n")
        );
        webix.message("CSS cdn list save complete");
      } catch (err) {
        webix.message({
          text: err.message,
          type: "error",
        });
      }
    };
    try {
      const result = await this.app.io.getObject("index.cdn.css");
      if ($$("sidebar").getSelectedId() === "css") {
        $$("cdn").clearAll();
        const url = result ? result.split("\n") : [];
        Object.keys(url).forEach((x) => {
          $$("cdn").add({
            url: url[x].replace(/^@import url\(/, "").replace(/\);$/, ""),
          });
        });
        if (url.length) $$("cdn").select($$("cdn").getFirstId());
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
