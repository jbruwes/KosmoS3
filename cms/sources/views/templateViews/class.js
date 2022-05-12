import { JetView } from "webix-jet";

/**
 * Класс для классов
 */
export default class ClassView extends JetView {
  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    id: "class",
    view: "datatable",
    select: "row",
    columns: [
      { id: "class", editor: "text", header: "class", fillspace: true },
    ],
    editable: true,
    on: {
      /**
       * Отрисовка на обновление
       */
      "data->onStoreUpdated": () => {
        this.getParentView().redraw.call(this.getParentView());
      },
    },
  });
}
