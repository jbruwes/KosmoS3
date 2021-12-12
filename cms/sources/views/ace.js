import { JetView } from "webix-jet";
import * as webix from "webix";
import "../ace";

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
      theme: "tomorrow",
      mode: "html",
    };
  }

  /**
   *
   */
  config = () => this.#config;

  /**
   * @param ace
   */
  init(ace) {
    ace.getEditor(true).then((editor) => {
      const session = editor.getSession();
      this.timeoutId = [];
      session.that = this;
      // session.setUseWorker(false);
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
    });
  }

  /**
   * @param html
   */
  setValue(html) {
    /**
     * @param {object} e an event
     * @param {object} session a session
     */
    function aceChange(e, session) {
      session.that.timeoutId.push(
        webix.delay(
          function webixDelay() {
            this.timeoutId.pop();
            if (!this.timeoutId.length)
              $$("tinymce").setValue(this.getRoot().getEditor().getValue());
          },
          session.that,
          [],
          1000
        )
      );
    }
    this.getRoot()
      .getEditor(true)
      .then((editor) => {
        const session = editor.getSession();
        session.off("change", aceChange, this);
        session.setValue(html, -1);
        session.on("change", aceChange, this);
        editor.resize();
      });
  }
}
