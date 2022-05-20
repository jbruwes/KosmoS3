import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import DOMPurify from "dompurify";
/**
 * Класс представления контента
 */
export default class ContentView extends JetView {
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
      id: "accordion",
      view: "accordion",
      on: {
        /**
         * Обработчик закрытия таба
         *
         * @param {string} id Идентификатор
         */
        onAfterCollapse: (id) => {
          if (id === "tools") {
            switch ($$("tabbar").getValue()) {
              case "ace-content":
                $$("ace-content").getEditor().resize();
                break;
              default:
            }
          }
        },
      },
      cols: [
        {
          view: "accordionitem",
          id: "contentItem",
          header: "<span class='mdi mdi-file-document-outline'></span>",
          body: {
            rows: [
              {
                id: "views",
                animate: false,
                keepViews: true,
                cells: [
                  {
                    $subview: "tinymce",
                  },
                  {
                    $subview: "ace",
                    id: "ace-content",
                  },
                ],
              },
              {
                view: "tabbar",
                id: "tabbar",
                options: [
                  {
                    value: "Visual",
                    id: "tinymce",
                    icon: "mdi mdi-eye-outline",
                  },
                  {
                    value: "Source",
                    id: "ace-content",
                    icon: "mdi mdi-code-tags",
                  },
                ],
                multiview: "true",
                type: "bottom",
                on: {
                  /**
                   * Обработчик переключения табов
                   */
                  onChange: () => {
                    if ($$("tabbar").getValue() === "ace-content")
                      $$("ace-content").$scope.setValue(
                        DOMPurify.sanitize($$("tinymce").getValue())
                      );
                  },
                },
              },
            ],
          },
        },
        {
          view: "accordionitem",
          collapsed: true,
          id: "tools",
          header: "<span class='mdi mdi-wrench-outline'></span> Tools",
          body: {
            id: "accordionRight",
            view: "accordion",
            type: "line",
            rows: [
              {
                view: "accordionitem",
                header: "<span class='mdi mdi-file-tree'></span> Tree",
                body: {
                  rows: [
                    {
                      $subview: "contentViews.toolbar",
                    },
                    {
                      $subview: "contentViews.tree",
                    },
                  ],
                },
              },
              {
                view: "accordionitem",
                header:
                  "<span class='mdi mdi-card-bulleted-settings-outline'></span> Properties",
                collapsed: true,
                body: {
                  $subview: "contentViews.properties",
                },
              },
            ],
          },
        },
      ],
    };
  }

  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => this.#config;

  /**
   * Запись контента
   */
  async save() {
    try {
      const lMessage = {
        pAccessKeyId: this.app.io.getAccessKeyId(),
        pSecretAccessKey: this.app.io.getSecretAccessKey(),
        pBucketName: this.app.io.getBucket(),
        pRegion: this.app.io.getRegion(),
        pEndpoint: this.app.io.getEndpoint(),
        pId: $$("tree").getSelectedId(),
      };
      await this.app.io.putObject(
        `${$$("tree").getSelectedId()}.htm`,
        "text/html",
        DOMPurify.sanitize($$("tinymce").getValue())
      );
      if (this.app) webix.message("Content save complete");
      const pageWorker = new Worker(
        new URL("../workers/page.js", import.meta.url)
      );
      pageWorker.postMessage(lMessage);
    } catch (err) {
      if (this.app)
        webix.message({
          text: err.message,
          type: "error",
        });
    }
  }
}
