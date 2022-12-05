import { JetView } from "webix-jet";

/**
 * Ксласс описания формы заголовка начальной страницы
 */
export default class TopView extends JetView {
  /**
   * Инициализация кофигурация класса
   *
   * @returns {object} Конфигурация
   */
  config = () => ({
    rows: [
      {
        id: "toolbar",
        view: "toolbar",
        height: 56,
        paddingX: 10,
        cols: [
          {
            view: "icon",
            icon: "mdi mdi-menu",
            /**
             * Обработчик нажатия на кнопку сендвич
             */
            click: () => {
              $$("sidebar").toggle();
            },
          },
          {
            view: "label",
            label: '<i class="rocket icon"></i> KosmoS3',
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
            data: [],
            /**
             * Обработчик переходов по меню
             *
             * @param {string} id Идентификатор кнопки
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
   * Обработчик готовности класса
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
