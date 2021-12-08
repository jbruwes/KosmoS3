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
          header: "CSS path",
          fillspace: true,
        },
      ],
      editable: true,
    };
  }

  config = () => this.#config;

  async init() {
    const onStoreUpdated = async () => {
      const url = [];
      $$("cdn")
        .serialize()
        .forEach((value) => url.push(`@import url(${value.url});`));
      try {
        await this.app.s3Client.send(
          new PutObjectCommand({
            Bucket: this.app.bucket,
            Key: `index.cdn.css`,
            ContentType: "text/css",
            Body: url.join("\n"),
          })
        );
        webix.message("CSS cdn list save complete");
      } catch (err) {
        webix.message({
          text: err.message,
          type: "error",
        });
      }
    };
    try {
      const result = new TextDecoder().decode(
        (
          await (
            await (
              await this.app.s3Client.send(
                new GetObjectCommand({
                  Bucket: this.app.bucket,
                  ResponseCacheControl: "no-store",
                  Key: "index.cdn.css",
                })
              )
            ).Body.getReader()
          ).read()
        ).value
      );
      if ($$("sidebar").getSelectedId() === "css") {
        $$("cdn").clearAll();
        const url = result ? result.split("\n") : [];
        Object.keys(url).forEach((x) => {
          $$("cdn").add({
            url: url[x].replace(/^@import url\(/, "").replace(/\);$/, ""),
          });
        });
        if (url.length) $$("cdn").select($$("cdn").getFirstId());
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
