import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";

/**
 *
 */
export default class SettingsView extends JetView {
  #config;

  #siteWorker;

  #event = [];

  /**
   *
   */
  destroy() {
    if (this.#event)
      this.#event.forEach((event) => event.component.detachEvent(event.id));
    this.#event = null;
    this.#config = null;
  }

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
              value: "Upload ico",
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
            {
              view: "uploader",
              id: "svgUploader",
              value: "Upload svg",
              multiple: false,
              autosend: false,
              name: "files",
              link: "svgBglist",
              accept: "image/svg+xml",
            },
            {
              view: "list",
              id: "svgBglist",
              type: "uploader",
              template:
                "{common.removeIcon()}{common.percent()}{common.fileName()}",
              autoheight: true,
              borderless: true,
            },
            {
              view: "uploader",
              id: "pngUploader",
              value: "Upload png",
              multiple: false,
              autosend: false,
              name: "files",
              link: "pngBglist",
              accept: "image/png",
            },
            {
              view: "list",
              id: "pngBglist",
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
   * @param uploader
   * @param filename
   */
  async doIcon(uploader, filename) {
    try {
      await this.app.io.headObject(filename);
      if (this.app) {
        uploader.files.data.clearAll();
        uploader.addFile(
          {
            name: filename,
            sname: filename,
          },
          0
        );
      }
    } catch (err) {
      // if (this.app) webix.message({text:err.message,type:"error"});
    } finally {
      if (this.app) {
        this.#event.push({
          component: uploader,
          id: uploader.attachEvent("onAfterFileAdd", async (pFile) => {
            const file = pFile;
            try {
              await this.app.io.putObject(filename, file.file.type, file.file);
              if (this.app) webix.message("Settings save complete");
            } catch (err) {
              if (this.app)
                webix.message({
                  text: err.message,
                  type: "error",
                });
            }
          }),
        });
        this.#event.push({
          component: uploader,
          id: uploader.files.attachEvent("onAfterDelete", async () => {
            try {
              await this.app.io.deleteObject(filename);
              if (this.app) webix.message("Settings save complete");
            } catch (err) {
              if (this.app)
                webix.message({
                  text: err.message,
                  type: "error",
                });
            }
          }),
        });
      }
    }
  }

  /**
   *
   */
  init() {
    this.doIcon($$("uploader"), "favicon.ico");
    this.doIcon($$("pngUploader"), "icon.png");
    this.doIcon($$("svgUploader"), "icon.svg");
    this.main();
  }

  /**
   *
   */
  async main() {
    try {
      this.prop = JSON.parse(await this.app.io.getObject("index.json"));
      if (this.app) {
        if (this.prop[0].yandex) $$("yandex").setValue(this.prop[0].yandex);
        if (this.prop[0].google) $$("google").setValue(this.prop[0].google);
        if (this.prop[0].metrika) $$("metrika").setValue(this.prop[0].metrika);
        if (this.prop[0].analytics)
          $$("analytics").setValue(this.prop[0].analytics);
        this.onChange();
      }
    } catch (err) {
      if (this.app) {
        webix.message({
          text: err.message,
          type: "error",
        });
        this.prop = [];
        this.onChange();
      }
    }
  }

  /**
   *
   */
  onChange() {
    this.#event.push({
      component: $$("yandex"),
      id: $$("yandex").attachEvent("onChange", (value) => {
        this.prop[0].yandex = value;
        this.save();
      }),
    });
    this.#event.push({
      component: $$("google"),
      id: $$("google").attachEvent("onChange", (value) => {
        this.prop[0].google = value;
        this.save();
      }),
    });
    this.#event.push({
      component: $$("metrika"),
      id: $$("metrika").attachEvent("onChange", (value) => {
        this.prop[0].metrika = value;
        this.save();
      }),
    });
    this.#event.push({
      component: $$("analytics"),
      id: $$("analytics").attachEvent("onChange", (value) => {
        this.prop[0].analytics = value;
        this.save();
      }),
    });
  }

  /**
   *
   */
  async save() {
    try {
      const lMessage = {
        pAccessKeyId: this.app.io.getAccessKeyId(),
        pSecretAccessKey: this.app.io.getSecretAccessKey(),
        pBucketName: this.app.io.getBucket(),
        pRegion: this.app.io.getRegion(),
        pEndpoint: this.app.io.getEndpoint(),
      };
      await this.app.io.putObject(
        "index.json",
        "application/json",
        webix.ajax().stringify(this.prop)
      );
      if (this.app) webix.message("Settings save complete");
      if (this.#siteWorker) this.#siteWorker.terminate();
      this.#siteWorker = new Worker(
        new URL("../workers/site.js", import.meta.url)
      );
      this.#siteWorker.postMessage(lMessage);
    } catch (err) {
      if (this.app)
        webix.message({
          text: err.message,
          type: "error",
        });
    }
  }
}
