import { JetView } from "webix-jet";
import * as webix from "webix";

/**
 * Ксласс описания формы заголовка начальной страницы
 */
export default class TopView extends JetView {
  /**
   * This method returns the initial UI configuration of a view
   *
   * @returns {object} The initial UI configuration of a view
   */
  config() {
    const ui = {
      rows: [
        {
          id: "toolbar",
          view: "toolbar",
          height: 56,
          // css: "webix_dark",
          cols: [
            {
              view: "icon",
              icon: "mdi mdi-menu",
              click: () => {
                $$("sidebar").toggle();
              },
            },
            {
              view: "label",
              label: '<i class="rocket icon"></i> KosmoS3 CMS',
            },
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
              click: (id) => {
                if (id === "signout") {
                  webix.delay(() => {
                    this.app.authenticationData = null;
                    this.show("signin");
                    this.resetSidebar();
                  });
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
    };
    return ui;
  }

  /**
   * Сброс сайдбара в состояние до логина
   */
  resetSidebar = () => {
    $$("sidebar").clearAll();
    if ($$("play")) $$("toolbar").removeView("play");
    $$("sidebar").add({
      id: "signin",
      icon: "mdi mdi-login-variant",
      value: "Sign In",
    });
    $$("sidebar").add({
      id: "about",
      icon: "mdi mdi-information-outline",
      value: "About",
    });
    $$("sidebar").select("signin");
  };

  /**
   * The method is called once when a view is rendered
   */
  init() {
    $$("sidebar")
      .getPopup()
      .attachEvent("onBeforeShow", () => {
        return false;
      });
    this.resetSidebar();
  }
}
