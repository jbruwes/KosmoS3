import { JetView } from "webix-jet";
import * as webix from "webix";

/**
 *
 */
export default class SettingsView extends JetView {
  #config;

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      rows: [
        {
          view: "form",
          autoheight: false,
          scroll: true,
          elements: [
            {
              template: "Yandex",
              type: "section",
            },
            {
              id: "yandex",
              view: "text",
              placeholder: "Yandex Verification ID",
            },
            {
              id: "metrika",
              view: "text",
              placeholder: "Yandex Metrika ID",
            },
            {
              template: "Google",
              type: "section",
            },
            {
              id: "google",
              view: "text",
              placeholder: "Google Verification ID",
            },
            {
              id: "analytics",
              view: "text",
              placeholder: "Google Analytics ID",
            },
            {
              template: "Icon",
              type: "section",
              css: "webix_section",
            },
            {
              view: "uploader",
              id: "uploader",
              value: "Upload Icon",
              multiple: false,
              autosend: false,
              name: "files",
              link: "bglist",
              accept: "image/vnd.microsoft.icon",
            },
            {
              view: "list",
              id: "bglist",
              type: "uploader",
              template:
                "{common.removeIcon()}{common.percent()}{common.fileName()}",
              autoheight: true,
              borderless: true,
            },
            {},
            {},
          ],
          elementsConfig: {
            labelAlign: "right",
          },
        },
      ],
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
    try {
      await this.app.io.headObject("favicon.ico");
      if ($$("sidebar").getSelectedId() === "settings") {
        $$("uploader").files.data.clearAll();
        $$("uploader").addFile(
          {
            name: "favicon.ico",
            sname: "favicon.ico",
          },
          0
        );
      }
    } catch (err) {
      // console.log(err);
    } finally {
      $$("uploader").attachEvent("onAfterFileAdd", async (pFile) => {
        const file = pFile;
        // file.file.sname = "favicon.ico";
        try {
          await this.app.io.putObject("favicon.ico", file.file.type, file.file);
          webix.message("Settings save complete");
        } catch (err) {
          webix.message({
            text: err.message,
            type: "error",
          });
        }
      });
      $$("uploader").files.attachEvent("onAfterDelete", async () => {
        try {
          await this.app.io.deleteObject("favicon.ico");
          webix.message("Settings save complete");
        } catch (err) {
          webix.message({
            text: err.message,
            type: "error",
          });
        }
      });
    }
    try {
      this.prop = JSON.parse(await this.app.io.getObject("index.json"));
      if (this.prop[0].yandex) $$("yandex").setValue(this.prop[0].yandex);
      if (this.prop[0].google) $$("google").setValue(this.prop[0].google);
      if (this.prop[0].metrika) $$("metrika").setValue(this.prop[0].metrika);
      if (this.prop[0].analytics)
        $$("analytics").setValue(this.prop[0].analytics);
      this.onChange();
    } catch (err) {
      webix.message({
        text: err.message,
        type: "error",
      });
      this.prop = [];
      this.onChange();
    }
  }

  /**
   *
   */
  onChange() {
    $$("yandex").attachEvent("onChange", (value) => {
      this.prop[0].yandex = value;
      this.save();
    });
    $$("google").attachEvent("onChange", (value) => {
      this.prop[0].google = value;
      this.save();
    });
    $$("metrika").attachEvent("onChange", (value) => {
      this.prop[0].metrika = value;
      this.save();
    });
    $$("analytics").attachEvent("onChange", (value) => {
      this.prop[0].analytics = value;
      this.save();
    });
  }

  /**
   *
   */
  async save() {
    try {
      await this.app.io.putObject(
        "index.json",
        "application/json",
        webix.ajax().stringify(this.prop)
      );
      webix.message("Settings save complete");
      if (this.siteWorker) this.siteWorker.terminate();
      this.siteWorker = new Worker(
        new URL("../workers/site.js", import.meta.url)
      );
      this.siteWorker.postMessage({
        pAccessKeyId: this.app.io.getAccessKeyId(),
        pSecretAccessKey: this.app.io.getSecretAccessKey(),
        pBucketName: this.app.io.getBucket(),
        pRegion: this.app.io.getRegion(),
      });
    } catch (err) {
      webix.message({
        text: err.message,
        type: "error",
      });
    }
  }
}
