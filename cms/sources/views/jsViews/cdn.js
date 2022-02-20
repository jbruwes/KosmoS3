import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";

/**
 *
 */
export default class CdnView extends JetView {
  #config;

  #event = [];

  /**
   *
   */
  destroy() {
    this.#event.forEach((event) => event.component.detachEvent(event.id));
  }

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
  init() {
    this.main();
  }

  /**
   *
   */
  async main() {
    if (this.app)
      try {
        $$("cdn").clearAll();
        $$("cdn").parse(await this.app.io.getObject("index.cdn.json"));
        if (this.app)
          this.#event.push({
            component: $$("cdn").data,
            id: $$("cdn").data.attachEvent("onStoreUpdated", async () => {
              if (this.app)
                try {
                  await this.app.io.putObject(
                    "index.cdn.json",
                    "application/json",
                    webix.ajax().stringify($$("cdn").serialize())
                  );
                  if (this.app) webix.message("JS cdn list save complete");
                } catch (err) {
                  if (this.app)
                    webix.message({
                      text: err.message,
                      type: "error",
                    });
                }
            }),
          });
      } catch (err) {
        if (this.app)
          webix.message({
            text: err.message,
            type: "error",
          });
      }
  }
}
