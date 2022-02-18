import { JetView } from "webix-jet";
import * as webix from "webix";
import "../../edittree";

/**
 *
 */
export default class TreeView extends JetView {
  /**
   *
   */
  config = () => ({
    view: "edittree",
    id: "tree",
    select: true,
    activeTitle: true,
    type: {
      /**
       * @param obj
       */
      visible(obj) {
        return `<span class='check mdi mdi-18px mdi-checkbox-${
          obj.visible ? "marked-" : "blank-"
        }outline'></span>`;
      },
    },
    onClick: {
      /**
       * @param e
       * @param id
       */
      check(e, id) {
        const item = this.getItem(id);
        item.visible = !item.visible;
        this.updateItem(id, item);
      },
    },
    template: "{common.icon()} {common.visible()} {common.folder()} #value#",
    checkboxRefresh: true,
    editable: true,
    onContext: {},
    editor: "text",
    editValue: "value",
    editaction: "dblclick",
    on: {
      /**
       *
       */
      onAfterLoad: async () => {
        if (
          !$$("sidebar").getSelectedId() ||
          $$("sidebar").getSelectedId() === "content"
        ) {
          $$("tree").data.attachEvent("onStoreUpdated", this.onChangeFnc);
          const id = $$("tree").getFirstId();
          const tinymce = await $$("tinymce").getEditor(true);
          if (id) $$("tree").select(id);
          else {
            tinymce.setMode("readonly");
            const ace = await $$("ace-content").getEditor(true);
            ace.setReadOnly(true);
          }
        }
      },
      onItemCheck: this.onChangeFnc,
      /**
       * @param id
       */
      onAfterSelect: async (id) => {
        const item = $$("tree").getItem(id);
        let result = "";
        this.getParentView().lockProperties = true;
        $$("contentItem").define(
          "header",
          `<span class='mdi mdi-file-document-outline'></span> ${item.value}`
        );
        $$("contentItem").refresh();
        item.lastmod = new Date().toISOString();
        item.date = item.date ? item.date : item.lastmod;
        $$("tree").updateItem(id, item);
        $$("url").setValue(item.url);
        $$("date").setValue(new Date(item.date));
        $$("changefreq").setValue(item.changefreq ? item.changefreq : "always");
        $$("priority").setValue(
          item.priority ? Number(item.priority).toFixed(1) : "0.5"
        );
        $$("description").setValue(item.description);
        $$("keywords").setValue(item.keywords);
        $$("title").setValue(item.title);
        $$("icon").setValue(item.icon);
        $$("uploader").files.data.clearAll();
        if (item.image) {
          $$("uploader").addFile(
            {
              name: item.image.split("/").pop(),
              sname: item.image,
            },
            0
          );
        }
        this.getParentView().lockProperties = false;
        if (this.app.io)
          try {
            result = await this.app.io.getObject(`${id}.htm`);
          } finally {
            if ($$("sidebar").getSelectedId() === "content") {
              $$("tinymce").$scope.setValue(result);
              $$("ace-content").$scope.setValue(result);
            }
          }
      },
      /**
       * @param state
       * @param editor
       * @param ignore
       */
      onBeforeEditStop: (state, editor, ignore) => {
        if (!(ignore && state.old)) {
          if (/[";,//?:@&=+$_]/.test(state.value)) {
            webix.message("Prohibited symbols are used", "debug");
            return false;
          }
          if (!state.value) {
            webix.message("Can't be empty", "debug");
            return false;
          }
        }
        $$("contentItem").define(
          "header",
          `<span class='mdi mdi-file-document-outline'></span> ${state.value}`
        );
        $$("contentItem").refresh();
        return true;
      },
    },
  });

  /**
   *
   */
  async init() {
    if (
      !$$("sidebar").getSelectedId() ||
      $$("sidebar").getSelectedId() === "content"
    ) {
      $$("tree").clearAll();
      $$("tree").parse(await this.app.io.getObject("index.json"));
    }
  }

  /**
   *
   */
  onChangeFnc = async () => {
    const tree = $$("tree").data.serialize();
    const [editors0, editors1] = await Promise.all([
      $$("tinymce").getEditor(true),
      $$("ace-content").getEditor(true),
    ]);
    if (!tree.length) {
      $$("tinymce").$scope.setValue("");
      editors0.setMode("readonly");
      editors1.setValue("");
      editors1.setReadOnly(true);
    } else {
      editors0.setMode("design");
      editors1.setReadOnly(false);
    }
    if (this.app && this.app.io)
      try {
        const lMessage = {
          pAccessKeyId: this.app.io.getAccessKeyId(),
          pSecretAccessKey: this.app.io.getSecretAccessKey(),
          pBucketName: this.app.io.getBucket(),
          pRegion: this.app.io.getRegion(),
        };
        await this.app.io.putObject(
          "index.json",
          "application/json",
          webix.ajax().stringify(tree)
        );
        webix.message("Tree save complete");
        if (this.siteWorker) this.siteWorker.terminate();
        this.siteWorker = new Worker(
          new URL("../../workers/site.js", import.meta.url)
        );
        this.siteWorker.postMessage(lMessage);
      } catch (err) {
        webix.message({
          text: err.message,
          type: "error",
        });
      }
  };
}
