import { JetView } from "webix-jet";
import * as webix from "webix";
import {
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export default class SettingsView extends JetView {
  #config;

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
              template: "Yandex Metrika",
              type: "section",
            },
            {
              id: "metrika",
              view: "text",
            },
            {
              template: "Google Analytics",
              type: "section",
            },
            {
              id: "analytics",
              view: "text",
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

  config = () => this.#config;

  async init() {
    try {
      await this.app.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.app.bucket,
          Key: `favicon.ico`,
        })
      );
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
          await this.app.s3Client.send(
            new PutObjectCommand({
              Bucket: this.app.bucket,
              Key: "favicon.ico",
              ContentType: file.file.type,
              Body: file.file,
            })
          );
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
          await this.app.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.app.bucket,
              Key: "favicon.ico",
            })
          );
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
      this.prop = JSON.parse(
        new TextDecoder().decode(
          (
            await (
              await (
                await this.app.s3Client.send(
                  new GetObjectCommand({
                    Bucket: this.app.bucket,
                    ResponseCacheControl: "no-store",
                    Key: "index.json",
                  })
                )
              ).Body.getReader()
            ).read()
          ).value
        )
      );
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

  onChange() {
    $$("metrika").attachEvent("onChange", (value) => {
      this.prop[0].metrika = value;
      this.save();
    });
    $$("analytics").attachEvent("onChange", (value) => {
      this.prop[0].analytics = value;
      this.save();
    });
  }

  async save() {
    try {
      await this.app.s3Client.send(
        new PutObjectCommand({
          Bucket: this.app.bucket,
          Key: "index.json",
          ContentType: "application/json",
          Body: webix.ajax().stringify(this.prop),
        })
      );
      webix.message("Settings save complete");
      if (this.siteWorker) this.siteWorker.terminate();
      this.siteWorker = new Worker(
        new URL("../workers/site.js", import.meta.url)
      );
      this.siteWorker.postMessage({
        pAccessKeyId: this.app.authenticationData.username,
        pSecretAccessKey: this.app.authenticationData.password,
        pBucketName: this.app.bucket,
        pRegion: this.app.region,
      });
    } catch (err) {
      webix.message({
        text: err.message,
        type: "error",
      });
    }
  }
}
