import { JetView } from "webix-jet";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import * as webix from "webix";

export default class CdnView extends JetView {
  #config;

  constructor(app) {
    super(app);
    this.#config = {
      id: "cdn",
      view: "datatable",
      select: "row",
      columns: [
        {
          id: "url",
          editor: "text",
          header: "JS path",
          fillspace: true,
        },
      ],
      editable: true,
    };
  }

  config() {
    return this.#config;
  }

  async init() {
    const onStoreUpdated = async () => {
      try {
        await this.app.s3Client.send(
          new PutObjectCommand({
            Bucket: this.app.bucket,
            Key: `index.cdn.json`,
            ContentType: "application/json",
            Body: webix.ajax().stringify($$("cdn").serialize()),
          })
        );
        webix.message("JS cdn list save complete");
      } catch (err) {
        webix.message({
          text: err.message,
          type: "error",
        });
      }
    };

    try {
      if ($$("sidebar").getSelectedId() === "js") {
        $$("cdn").clearAll();
        $$("cdn").parse(
          new TextDecoder().decode(
            (
              await (
                await (
                  await this.app.s3Client.send(
                    new GetObjectCommand({
                      Bucket: this.app.bucket,
                      ResponseCacheControl: "no-store",
                      Key: "index.cdn.json",
                    })
                  )
                ).Body.getReader()
              ).read()
            ).value
          )
        );
        $$("cdn").data.attachEvent("onStoreUpdated", onStoreUpdated);
      }
    } catch (err) {
      webix.message({
        text: err.message,
        type: "error",
      });
    }
  }
}
