import { JetView } from "webix-jet";

/**
 * Ксласс описания формы заголовка начальной страницы
 */
export default class TopView extends JetView {
  /**
   *
   */
  config = () => ({
    rows: [
      {
        id: "toolbar",
        view: "toolbar",
        height: 56,
        // css: "webix_dark",
        paddingX: 10,
        cols: [
          {
            view: "icon",
            icon: "mdi mdi-menu",
            /**
             *
             */
            click: () => $$("sidebar").toggle(),
          },
          {
            view: "label",
            label: '<i class="rocket icon"></i> KosmoS3 CMS',
          },
          { view: "label", label: `v. ${VERSION}`, align: "right" },
        ],
      },
      {
        cols: [
          {
            view: "sidebar",
            collapsed: true,
            id: "sidebar",
            // css: "webix_dark",
            data: [],
            /**
             * @param id
             */
            click: async (id) => {
              if (id === "signout") {
                this.app.io = null;
                await this.show("signin");
                this.app.refresh();
              } else this.show(id);
            },
          },
          {
            type: "wide",
            padding: 2,
            css: "app_layout",
            rows: [
              {
                $subview: true,
              },
            ],
          },
        ],
      },
    ],
  });

  /**
   * The method is called once when a view is rendered
   */
  ready() {
    this.$$("sidebar")
      .getPopup()
      .attachEvent("onBeforeShow", () => false);
    this.$$("sidebar").add({
      id: "signin",
      icon: "mdi mdi-login-variant",
      value: "Sign In",
    });
    this.$$("sidebar").add({
      id: "about",
      icon: "mdi mdi-information-outline",
      value: "About",
    });
    this.$$("sidebar").select("signin");
  }
}
