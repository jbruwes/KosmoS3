import { JetView } from "webix-jet";
import * as webix from "webix";
import "../ace";

/**
 *
 */
export default class AceView extends JetView {
  #config = null;

  #timeoutId = [];

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
  async init() {
    const editor = await this.getRoot().getEditor(true);
    const session = editor.getSession();
    session.on("changeAnnotation", function onChangeAnnotation() {
      const annotations = session.getAnnotations() || [];
      const len = annotations.length;
      let i = len;
      while (i) {
        i -= 1;
        if (/doctype first\. Expected/.test(annotations[i].text))
          annotations.splice(i, 1);
      }
      if (len > annotations.length) session.setAnnotations(annotations);
    });
    session.setUseWrapMode(true);
  }

  /**
   */
  aceChange = () => {
    this.#timeoutId.push(
      webix.delay(
        () => {
          this.#timeoutId.pop();
          if (!this.#timeoutId.length)
            $$("tinymce").setValue(this.getRoot().getEditor().getValue());
        },
        this,
        [],
        1000
      )
    );
  };

  /**
   * @param html
   */
  async setValue(html) {
    const editor = await this.getRoot().getEditor(true);
    const session = editor.getSession();
    session.off("change", this.aceChange, this);
    session.setValue(html, -1);
    session.on("change", this.aceChange, this);
    editor.resize();
  }
}
