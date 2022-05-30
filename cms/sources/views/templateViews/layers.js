import $ from "jquery/dist/jquery.slim";
import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import "../../editlist";
import "../../fabricjs";

/**
 * Класс слоёв
 */
export default class LayersView extends JetView {
  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    view: "editlist",
    id: "layers",
    select: "row",
    editable: true,
    editaction: "dblclick",
    editor: "text",
    editValue: "value",
    type: {
      /**
       * Маркировка элемента списка
       *
       * @param {object} obj Объект элемента списка
       * @returns {string} Сформатированный html для вывода чекбокса
       */
      markCheckbox: (obj) =>
        `<span class='check mdi mdi-18px mdi-checkbox-${
          obj.markCheckbox ? "marked-" : "blank-"
        }outline'></span>`,
    },
    onClick: {
      /**
       * Обработка клика на элемент списка
       *
       * @param {object} e Событие
       * @param {string} id Идентификатор
       */
      check: (e, id) => {
        const item = $$("layers").getItem(id);
        const item1 = this.getParentView().body.find(`#${item.value}`);
        const item2 = $($$("fabric").getIframe())
          .contents()
          .find(`#${item.value}`);
        item.markCheckbox = item.markCheckbox ? 0 : 1;
        if (item.markCheckbox) {
          item1.removeAttr("hidden");
          item2.removeAttr("hidden");
          item1.parent().removeAttr("hidden");
          item2.parent().removeAttr("hidden");
        } else {
          item1.parent().attr("hidden", "");
          item2.parent().attr("hidden", "");
        }
        $$("layers").updateItem(id, item);
      },
    },
    template:
      "<span class='mdi mdi-dark mdi-inactive mdi-18px mdi-#icon#'></span> {common.markCheckbox()} #value#",
    on: {
      /**
       * Обработка смены текужего элемента списка
       */
      onSelectChange: () => {
        const that = this.getParentView();
        const selectedItem = that.makeSelection.call(that);
        if (selectedItem) that.setParams.call(that, selectedItem);
      },
      /**
       * Перерисовка на изменение данных
       */
      "data->onStoreUpdated": () => {
        this.getParentView().redraw.call(this.getParentView(), true);
      },
      /**
       * Обработчик введенных значений
       *
       * @param {object} state Объект с состояниями
       * @param {object} editor Объект редактора
       * @param {boolean} ignore Флаг изменения после редактирования
       * @returns {boolean} Флаг разрешения окончания редактирования
       */
      onBeforeEditStop: (state, editor, ignore) => {
        const that = this.getParentView();
        const fabricDocument = $($$("fabric").getIframe()).contents();
        if (!(ignore && state.old)) {
          if (
            !state.value ||
            (state.old !== state.value &&
              that.body.find(`#${state.value}`).length !== 0)
          ) {
            webix.message(
              state.value ? "The id is already exists" : "Can't be empty",
              "debug"
            );
            return false;
          }
          if (!/^[A-Za-z][-A-Za-z0-9_]*$/.test(state.value)) {
            webix.message("Prohibited symbols are used", "debug");
            return false;
          }
          that.body.find(`#${state.old}`).attr("id", state.value);
          that.zIndex.call(that, that.body);
          fabricDocument.find(`#${state.old}`).attr("id", state.value);
          that.zIndex.call(that, fabricDocument);
        }
        $$("templateItem").define(
          "header",
          `<span class='mdi mdi-postage-stamp'></span> ${state.value}`
        );
        $$("templateItem").refresh();
        return true;
      },
      /**
       * Не даем переименовать слой контента
       *
       * @param {string} id Идентификатор слоя
       * @returns {boolean} Флаг разрешения окончания редактирования
       */
      onBeforeEditStart: (id) => {
        if ($$("layers").getItem(id).value === "content") {
          webix.message("Rename is prohibited", "debug");
          return false;
        }
        return true;
      },
    },
  });
}
