import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import "../../ace";

/**
 *
 */
export default class AceView extends JetView {
  #config;

  #session;

  /**
   *
   */
  destroy() {
    if (this.#session) this.#session.removeAllListeners("change");
  }

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      view: "ace-editor",
      id: "ace-js",
      theme: "tomorrow",
      mode: "javascript",
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
   * @param text
   */
  async cb(text) {
    const timeoutId = [];
    const that = this;
    if (this.app) {
      const editor = await $$("ace-js").getEditor(true);
      if (this.app) {
        this.#session = editor.getSession();
        this.#session.setUseWrapMode(true);
        this.#session.setValue(
          text
            .replace(/^function init\(\){try{/, "")
            .replace(/}catch\(e\){}}$/, ""),
          -1
        );
        this.#session.on("change", () => {
          timeoutId.push(
            webix.delay(
              async () => {
                timeoutId.pop();
                if (!timeoutId.length) {
                  if (this.app)
                    try {
                      await this.app.io.putObject(
                        "index.js",
                        "application/javascript",
                        `function init(){try{${$$("ace-js")
                          .getEditor()
                          .getValue()}}catch(e){}}`
                      );
                      if (this.app) webix.message("JS save complete");
                    } catch (err) {
                      if (this.app)
                        webix.message({
                          text: err.message,
                          type: "error",
                        });
                    }
                }
              },
              that,
              [],
              1000
            )
          );
        });
        editor.resize();
      }
    }
  }

  /**
   *
   */
  async main() {
    if (this.app)
      try {
        const indexJs = await this.app.io.getObject("index.js");
        if (this.app) this.cb(indexJs);
      } catch (err) {
        if (this.app) this.cb("");
      }
  }
}
