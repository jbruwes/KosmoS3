import { JetView } from "webix-jet";

/**
 * Класс данных
 */
export default class DataView extends JetView {
  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    id: "data",
    view: "datatable",
    select: "row",
    columns: [
      { id: "data", editor: "text", header: "data-", fillspace: true },
      { id: "value", editor: "text", header: "value", fillspace: true },
    ],
    editable: true,
    on: {
      /**
       * Отрисовка при изменении данных
       */
      "data->onStoreUpdated": () => {
        this.getParentView().redraw.call(this.getParentView());
      },
    },
  });
}
