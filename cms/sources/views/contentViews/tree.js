import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import "../../edittree";

/**
 *
 */
export default class TreeView extends JetView {
  #siteWorker;

  #tinymce;

  #ace;

  #event = [];

  /**
   *
   */
  destroy() {
    if (this.#event)
      this.#event.forEach((event) => event.component.detachEvent(event.id));
    this.#event = null;
    this.#tinymce = null;
    this.#ace = null;
  }

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
        this.#event.push({
          component: $$("tree").data,
          id: $$("tree").data.attachEvent("onStoreUpdated", this.onChangeFnc),
        });
        const id = $$("tree").getFirstId();
        [this.#tinymce, this.#ace] = await Promise.all([
          $$("tinymce").getEditor(true),
          $$("ace-content").getEditor(true),
        ]);
        if (this.app)
          if (id) $$("tree").select(id);
          else {
            this.#tinymce.mode.set("readonly");
            this.#ace.setReadOnly(true);
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
        try {
          result = await this.app.io.getObject(`${id}.htm`);
        } finally {
          if (this.app) {
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
  init() {
    this.main();
  }

  /**
   *
   */
  async main() {
    try {
      $$("tree").clearAll();
      const indexJson = await this.app.io.getObject("index.json");
      if (this.app) $$("tree").parse(indexJson);
    } catch (err) {
      if (this.app)
        webix.message({
          text: err.message,
          type: "error",
        });
    }
  }

  /**
   *
   */
  onChangeFnc = async () => {
    const tree = $$("tree").data.serialize();
    if (!tree.length) {
      $$("tinymce").$scope.setValue("");
      this.#tinymce.mode.set("readonly");
      this.#ace.setValue("");
      this.#ace.setReadOnly(true);
    } else {
      this.#tinymce.mode.set("design");
      this.#ace.setReadOnly(false);
    }
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
      if (this.app) webix.message("Tree save complete");
      if (this.#siteWorker) {
        this.#siteWorker.terminate();
        this.#siteWorker = null;
      }
      this.#siteWorker = new Worker(
        new URL("../../workers/site.js", import.meta.url)
      );
      this.#siteWorker.postMessage(lMessage);
    } catch (err) {
      if (this.app)
        webix.message({
          text: err.message,
          type: "error",
        });
    }
  };
}
