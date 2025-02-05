import { JetView } from "webix-jet";

/**
 * Класс представления тулбара для стилей
 */
export default class CdnToolbarView extends JetView {
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
           * Новая ссылка
           */
          click: () => {
            $$("cdn").select($$("cdn").add({ url: "" }));
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-delete-outline",
          /**
           * Удвлить ссылку
           */
          click: () => {
            const id = $$("cdn").getSelectedId();
            if (id) {
              let newId = $$("cdn").getPrevId(id);
              if (!newId) newId = $$("cdn").getNextId(id);
              $$("cdn").remove(id);
              if (newId) $$("cdn").select(newId);
            }
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-arrow-up-bold-box-outline",
          /**
           * Ссылка вверх
           */
          click: () => {
            const id = $$("cdn").getSelectedId();
            if (id) $$("cdn").moveUp(id);
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-arrow-down-bold-box-outline",
          /**
           * Ссылка вниз
           */
          click: () => {
            const id = $$("cdn").getSelectedId();
            if (id) $$("cdn").moveDown(id);
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
