import { JetView } from "webix-jet";

/**
 * Класс тулбара для данных
 */
export default class DataToolbarView extends JetView {
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
           * Новые данные
           */
          click: () => {
            $$("data").select(
              $$("data").add({
                data: "",
                value: "",
              })
            );
          },
        },
        {
          view: "icon",
          icon: "mdi mdi-delete-outline",
          /**
           * Удаление данных
           */
          click: () => {
            const id = $$("data").getSelectedId();
            if (id) {
              $$("data").editCancel();
              let newId = $$("data").getPrevId(id);
              if (!newId) newId = $$("data").getNextId(id);
              $$("data").remove(id);
              if (newId) $$("data").select(newId);
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
