import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import DOMPurify from "dompurify";
import "../../edittree";

/**
 * Класс представления дерева
 */
export default class TreeView extends JetView {
  #siteWorker;

  #tinymce;

  #ace;

  #event = [];

  /**
   * Деструктор
   */
  destroy() {
    if (this.#event)
      this.#event.forEach((event) => event.component.detachEvent(event.id));
    this.#event = null;
    this.#tinymce = null;
    this.#ace = null;
  }

  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    view: "edittree",
    id: "tree",
    select: true,
    activeTitle: true,
    type: {
      /**
       * Рендер чекбокса
       *
       * @param {object} obj Элемент дерева
       * @returns {string} Html чекбокса
       */
      visible: (obj) =>
        `<span class='check mdi mdi-18px mdi-checkbox-${
          obj.visible ? "marked-" : "blank-"
        }outline'></span>`,
    },
    onClick: {
      /**
       * Клик по элементу дерева
       *
       * @param {object} e Событие
       * @param {string} id Идентификатор
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
       * Обработчик после загрузки дерева
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
       * Обработчик выделения элемента дерева
       *
       * @param {string} id Идентификатор
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
          result = DOMPurify.sanitize(
            await this.app.io.getObject(`${id}.htm`),
            {
              ADD_TAGS: ["iframe"],
              ADD_ATTR: [
                "target",
                "allow",
                "allowfullscreen",
                "frameborder",
                "scrolling",
              ],
              CUSTOM_ELEMENT_HANDLING: {
                tagNameCheck: /^v-/,
                attributeNameCheck: null,
                allowCustomizedBuiltInElements: true,
              },
            }
          );
        } catch (err) {
          result =
            '<div class="ui fluid placeholder"><div class="image header"><div class="line"></div><div class="line"></div></div><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div>';
        } finally {
          if (this.app) {
            $$("tinymce").$scope.setValue(result);
            $$("ace-content").$scope.setValue($$("tinymce").getValue());
          }
        }
      },
      /**
       * Проверка правильности ввода названия элемента дерева
       *
       * @param {object} state Объект со старым и новым название
       * @param {object} editor Объект редактора
       * @param {boolean} ignore Флаг признака изменения названия
       * @returns {boolean} Флаг проверки
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
   * Обработчик готовности представления класса
   */
  async ready() {
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
   * Обработчик изменения элементов дерева
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
        pEndpoint: this.app.io.getEndpoint(),
      };
      await this.app.io.putObject(
        "index.json",
        "application/json;charset=utf-8",
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
