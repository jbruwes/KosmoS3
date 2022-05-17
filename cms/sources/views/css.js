import { JetView } from "webix-jet";

/**
 * Класс представления css
 */
export default class CssView extends JetView {
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
      rows: [
        {
          id: "views",
          animate: false,
          keepViews: true,
          cells: [
            { $subview: "cssViews.ace" },
            {
              id: "cdn-css",
              rows: [
                { $subview: "cssViews.cdntoolbar" },
                { $subview: "cssViews.cdn" },
              ],
            },
          ],
        },
        {
          view: "tabbar",
          id: "tabbar",
          options: [
            { value: "CSS", id: "ace-css", icon: "mdi mdi-language-css3" },
            {
              value: "External",
              id: "cdn-css",
              icon: "mdi mdi-folder-network-outline",
            },
          ],
          multiview: "true",
          type: "bottom",
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
}
