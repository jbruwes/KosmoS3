import { JetView } from "webix-jet";
import * as webix from "webix";

/**
 *
 */
export default class ContentView extends JetView {
  #config;

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      id: "accordion",
      view: "accordion",
      on: {
        /**
         * @param id
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
                   *
                   */
                  onChange: () => {
                    if ($$("tabbar").getValue() === "ace-content")
                      $$("ace-content").$scope.setValue(
                        $$("tinymce").getValue()
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
   *
   */
  config = () => this.#config;

  /**
   *
   */
  init() {
    this.pageWorker = new Worker(
      new URL("../workers/page.js", import.meta.url)
    );
  }

  /**
   *
   */
  async save() {
    try {
      await this.app.io.putObject(
        `${$$("tree").getSelectedId()}.htm`,
        "text/html",
        $$("tinymce").getValue()
      );
      webix.message("Content save complete");
      this.pageWorker.postMessage({
        pAccessKeyId: this.app.authenticationData.username,
        pSecretAccessKey: this.app.authenticationData.password,
        pBucketName: this.app.bucket,
        pRegion: this.app.region,
        pId: $$("tree").getSelectedId(),
      });
    } catch (err) {
      webix.message({
        text: err.message,
        type: "error",
      });
    }
  }
}
