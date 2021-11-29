import { JetView } from "webix-jet";
import * as webix from "webix";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import "../../ace";

export default class AceView extends JetView {
  #config;

  constructor(app) {
    super(app);
    this.#config = {
      view: "ace-editor",
      id: "ace-js",
      theme: "tomorrow",
      mode: "javascript",
    };
  }

  config() {
    return this.#config;
  }

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
                await this.app.s3Client.send(
                  new PutObjectCommand({
                    Bucket: this.app.bucket,
                    ContentType: "application/javascript",
                    Key: `index.js`,
                    Body: `function init(){try{${$$("ace-js")
                      .getEditor()
                      .getValue()}}catch(e){}}`,
                  })
                );
                webix.message("JS save complete");
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
    const cb = async (text) => {
      if ($$("sidebar").getSelectedId() === "js") {
        const editor = await $$("ace-js").getEditor(true);
        const session = editor.getSession();
        this.timeoutId = [];
        session.that = this;
        session.setUseWrapMode(true);
        session.setValue(
          text
            .replace(/^function init\(\){try{/, "")
            .replace(/}catch\(e\){}}$/, ""),
          -1
        );
        session.on("change", aceChange, this);
        editor.resize();
      }
    };
    try {
      cb(
        new TextDecoder().decode(
          (
            await (
              await (
                await this.app.s3Client.send(
                  new GetObjectCommand({
                    Bucket: this.app.bucket,
                    ResponseCacheControl: "no-store",
                    Key: "index.js",
                  })
                )
              ).Body.getReader()
            ).read()
          ).value
        )
      );
    } catch (err) {
      cb("");
    }
  }
}
