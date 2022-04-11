import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import "../../ace";

/**
 *
 */
export default class AceView extends JetView {
  #config;

  #editor;

  #session;

  /**
   *
   */
  destroy() {
    if (this.#session) this.#session.removeAllListeners("change");
    this.#config = null;
    this.#editor = null;
    this.#session = null;
  }

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      id: "ace-js",
      view: "ace-editor",
      theme: "tomorrow",
      mode: "javascript",
    };
  }

  /**
   *
   */
  config = () => this.#config;

  /**
   * @param text
   */
  async cb(text) {
    const timeoutId = [];
    this.#editor = await $$("ace-js").getEditor(true);
    if (this.app) {
      this.#session = this.#editor.getSession();
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
                try {
                  await this.app.io.putObject(
                    "index.js",
                    "application/javascript",
                    `function init(){try{${this.#editor.getValue()}}catch(e){}}`
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
            this,
            [],
            1000
          )
        );
      });
      this.#editor.resize();
    }
  }

  /**
   *
   */
  async ready() {
    try {
      const indexJs = await this.app.io.getObject("index.js");
      if (this.app) this.cb(indexJs);
    } catch (err) {
      if (this.app) this.cb("");
    }
  }
}
