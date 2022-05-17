import { JetView } from "webix-jet";

/**
 * Класс представления js
 */
export default class JsView extends JetView {
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
            { $subview: "jsViews.ace" },
            {
              id: "cdn-js",
              rows: [
                { $subview: "jsViews.cdntoolbar" },
                { $subview: "jsViews.cdn" },
              ],
            },
          ],
        },
        {
          view: "tabbar",
          id: "tabbar",
          options: [
            { value: "JS", id: "ace-js", icon: "mdi mdi-language-javascript" },
            {
              value: "External",
              id: "cdn-js",
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
