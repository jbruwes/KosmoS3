import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import "../ace";

/**
 *
 */
export default class AceView extends JetView {
  #config;

  #editor;

  #session;

  #timeoutId = [];

  /**
   *
   */
  destroy() {
    if (this.#session) {
      this.#session.removeAllListeners("changeAnnotation");
      this.#session.removeAllListeners("change");
    }
    this.#config = null;
    this.#editor = null;
    this.#session = null;
    this.#timeoutId = null;
  }

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      view: "ace-editor",
      theme: "tomorrow",
      mode: "html",
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
   * @param html
   */
  async setValue(html) {
    const aceChange = () => {
      this.#timeoutId.push(
        webix.delay(
          () => {
            this.#timeoutId.pop();
            if (!this.#timeoutId.length)
              $$("tinymce").setValue(this.#editor.getValue());
          },
          this,
          [],
          1000
        )
      );
    };
    this.#session.off("change", aceChange);
    this.#session.setValue(html, -1);
    this.#session.on("change", aceChange);
    this.#editor.resize();
  }

  async main() {
    this.#editor = await this.getRoot().getEditor(true);
    if (this.app) {
      this.#session = this.#editor.getSession();
      this.#session.on("changeAnnotation", () => {
        const annotations = this.#session.getAnnotations() || [];
        const len = annotations.length;
        let i = len;
        while (i) {
          i -= 1;
          if (/doctype first\. Expected/.test(annotations[i].text))
            annotations.splice(i, 1);
        }
        if (len > annotations.length) this.#session.setAnnotations(annotations);
      });
      this.#session.setUseWrapMode(true);
    }
  }
}
