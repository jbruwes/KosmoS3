import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";

/**
 * Класс представления тулбара для дерева
 */
export default class ToolbarView extends JetView {
  #config;

  /**
   * Деструктор
   */
  destroy() {
    this.#config = null;
  }

  /**
   * Конструктор
   *
   * @param {object} app Объект приложения
   */
  constructor(app) {
    super(app);
    this.#config = {
      view: "toolbar",
      cols: [
        {
          view: "icon",
          icon: "mdi mdi-file-document-outline",
          /**
           * Новый элемент дерева
           */
          click: () => {
            const sel = $$("tree").getSelectedId();
            const curDate = new Date().toISOString();
            let item = null;
            if (sel) {
              let parent = $$("tree").getParentId(sel);
              if (!parent) parent = sel;
              item = $$("tree").add(
                {
                  url: "",
                  description: "",
                  title: "",
                  icon: "",
                  lastmod: curDate,
                  date: curDate,
                  keywords: "",
                  image: "",
                  priority: "",
                  changefreq: "",
                  visible: true,
                  value: `article-${webix.uid()}`,
                },
                parent === sel ? 0 : $$("tree").getBranchIndex(sel) + 1,
                parent
              );
              $$("tree").open(parent);
            } else {
              item = $$("tree").add({
                url: "",
                description: "",
                title: "",
                lastmod: curDate,
                date: curDate,
                keywords: "",
                image: "",
                priority: "",
                changefreq: "",
                visible: true,
                value: `article-${webix.uid()}`,
              });
            }
            $$("tree").select(item);
            $$("tree").edit(item);
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-pencil",
          /**
           * Редактирование название элемента дерева
           */
          click: () => {
            $$("tree").edit($$("tree").getSelectedId());
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-delete-outline",
          /**
           * Удаление элемента дерева
           */
          click: () => {
            const sel = $$("tree").getSelectedId();
            const sel2 =
              $$("tree").getNextSiblingId(sel) ||
              $$("tree").getPrevSiblingId(sel) ||
              $$("tree").getParentId(sel);
            if (sel2) {
              webix.confirm("Are you sure?", (result) => {
                if (result) {
                  $$("tree").remove(sel);
                  $$("tree").select(sel2);
                }
              });
            } else {
              webix.message({
                text: "You can't delete the root of the tree",
                type: "error",
              });
            }
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-arrow-up-bold-box-outline",
          /**
           * Элемент вверх
           */
          click: () => {
            const sel = $$("tree").getSelectedId();
            if ($$("tree").getPrevSiblingId(sel)) {
              $$("tree").move(sel, $$("tree").getBranchIndex(sel) - 1, null, {
                parent: $$("tree").getParentId(sel),
              });
            }
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-arrow-down-bold-box-outline",
          /**
           * Элемент вниз
           */
          click: () => {
            const sel = $$("tree").getSelectedId();
            if ($$("tree").getNextSiblingId(sel)) {
              $$("tree").move(sel, $$("tree").getBranchIndex(sel) + 1, null, {
                parent: $$("tree").getParentId(sel),
              });
            }
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-arrow-left-bold-box-outline",
          /**
           * Элемент налево
           */
          click: () => {
            const sel = $$("tree").getSelectedId();
            const par = $$("tree").getParentId(sel);
            if (par) {
              const parent = $$("tree").getParentId(par);
              if (parent) {
                $$("tree").move(sel, $$("tree").getBranchIndex(par) + 1, null, {
                  parent,
                });
              }
            }
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-arrow-right-bold-box-outline",
          /**
           * Элемент направо
           */
          click: () => {
            const sel = $$("tree").getSelectedId();
            const sib = $$("tree").getPrevSiblingId(sel);
            if (sib) {
              $$("tree").move(sel, -1, null, {
                parent: sib,
              });
              $$("tree").open(sib);
            }
          },
        },
        {},
      ],
    };
  }

  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => this.#config;
}
