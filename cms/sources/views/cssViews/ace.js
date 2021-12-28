import { JetView } from "webix-jet";
import * as webix from "webix";
import "../../ace";

/**
 *
 */
export default class AceView extends JetView {
  #config;

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      view: "ace-editor",
      id: "ace-css",
      theme: "tomorrow",
      mode: "css",
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
     * @param {object} e an event
     * @param {object} session a session
     */
    function aceChange(e, session) {
      session.that.timeoutId.push(
        webix.delay(
          async function webixDelay() {
            this.timeoutId.pop();
            if (!this.timeoutId.length) {
              try {
                await this.app.io.putObject(
                  "index.css",
                  "text/css",
                  $$("ace-css").getEditor().getValue()
                );
                webix.message("CSS save complete");
              } catch (err) {
                webix.message({
                  text: err.message,
                  type: "error",
                });
              }
            }
          },
          session.that,
          [],
          1000
        )
      );
    }
    /**
     * @param text
     */
    const cb = async (text) => {
      if ($$("sidebar").getSelectedId() === "css") {
        const editor = await $$("ace-css").getEditor(true);
        const session = editor.getSession();
        this.timeoutId = [];
        session.that = this;
        session.setUseWrapMode(true);
        session.setValue(text, -1);
        session.on("change", aceChange, this);
        editor.resize();
      }
    };
    try {
      cb(await this.app.io.getObject("index.css"));
    } catch (err) {
      cb("");
    }
  }
}
