import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import meta from "@mdi/svg/meta.json";

/**
 * Класс представления свойств страницы контента
 */
export default class PropertiesView extends JetView {
  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    view: "form",
    id: "propForm",
    scroll: true,
    elements: [
      {
        rows: [
          {
            template: "Title",
            type: "section",
            css: "webix_section",
          },
          {
            view: "text",
            id: "title",
            label:
              "<span class='mdi mdi-dark mdi-24px mdi-window-maximize'></span>",
            labelWidth: 33,
            on: {
              /**
               * Обработчик смены заголовка
               *
               * @param {string} value Новый заголовок
               */
              onChange: (value) => {
                let id;
                let item;
                if (!this.getParentView().lockProperties) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  item.title = value;
                  $$("tree").updateItem(id, item);
                }
              },
            },
          },
          {
            template: "Description",
            type: "section",
            css: "webix_section",
          },
          {
            view: "textarea",
            id: "description",
            label:
              "<span class='mdi mdi-dark mdi-24px mdi-card-text-outline'></span>",
            labelWidth: 33,
            height: 100,
            on: {
              /**
               * Обработчик смены описания
               *
               * @param {string} value Новое описание
               */
              onChange: (value) => {
                let id;
                let item;
                if (!this.getParentView().lockProperties) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  item.description = value;
                  $$("tree").updateItem(id, item);
                }
              },
            },
          },
          {
            template: "Keywords",
            type: "section",
            css: "webix_section",
          },
          {
            view: "textarea",
            id: "keywords",
            label: "<span class='mdi mdi-dark mdi-24px mdi-key-change'></span>",
            labelWidth: 33,
            height: 100,
            on: {
              /**
               * Обработчик смены ключевых слов
               *
               * @param {string} value Ключевые слова
               */
              onChange: (value) => {
                let id;
                let item;
                if (!this.getParentView().lockProperties) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  item.keywords = value;
                  $$("tree").updateItem(id, item);
                }
              },
            },
          },
          {
            template: "Hard Link",
            type: "section",
            css: "webix_section",
          },
          {
            view: "text",
            id: "url",
            name: "url",
            label:
              "<span class='mdi mdi-dark mdi-24px mdi-link-variant'></span>",
            invalidMessage: "Prohibited symbols are used",
            labelWidth: 33,
            on: {
              /**
               * Обработчик смены постоянной ссылки
               *
               * @param {string} value Постоянная ссылка
               */
              onChange: (value) => {
                let id;
                let item;
                if (
                  !this.getParentView().lockProperties &&
                  $$("propForm").validate()
                ) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  item.url = value;
                  $$("tree").updateItem(id, item);
                }
              },
            },
          },
          {
            template: "Date",
            type: "section",
            css: "webix_section",
          },
          {
            view: "datepicker",
            id: "date",
            label: "<span class='mdi mdi-dark mdi-24px mdi-calendar'></span>",
            labelWidth: 33,
            on: {
              /**
               * Обработчик смены даты
               *
               * @param {Date} value Дата
               */
              onChange: (value) => {
                let id;
                let item;
                if (!this.getParentView().lockProperties) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  // var format = webix.Date.dateToStr("%Y-%m-%d");
                  // item.date = format(value);
                  item.date = value.toISOString();
                  $$("tree").updateItem(id, item);
                }
              },
            },
          },
          {
            template: "Change Frequency",
            type: "section",
            css: "webix_section",
          },
          {
            view: "richselect",
            id: "changefreq",
            label: "<span class='mdi mdi-dark mdi-24px mdi-current-ac'></span>",
            labelWidth: 33,
            options: [
              "always",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly",
              "never",
            ],
            on: {
              /**
               * Обработчик смены частоты обновления
               *
               * @param {number} value Частота обновления
               */
              onChange: (value) => {
                let id;
                let item;
                if (!this.getParentView().lockProperties) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  item.changefreq = value;
                  $$("tree").updateItem(id, item);
                }
              },
            },
          },
          {
            template: "Priority",
            type: "section",
            css: "webix_section",
          },
          {
            view: "slider",
            id: "priority",
            label:
              '<span class="mdi mdi-dark mdi-24px mdi-flag-variant-outline"></span>',
            labelWidth: 33,
            min: "0",
            max: "1",
            step: "0.1",
            value: "0.5",
            type: "alt",
            on: {
              /**
               * Обработчик смены приоритета
               *
               * @param {number} value Приоритет
               */
              onChange: (value) => {
                let id;
                let item;
                if (!this.getParentView().lockProperties) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  item.priority = value.toFixed(1);
                  $$("tree").updateItem(id, item);
                }
              },
            },
          },
          {
            template: "Icon",
            type: "section",
            css: "webix_section",
          },
          {
            view: "combo",
            id: "icon",
            label:
              '<span class="mdi mdi-dark mdi-24px mdi-postage-stamp"></span>',
            labelWidth: 33,
            on: {
              /**
               * Обработчик смены иконки
               *
               * @param {string} value Иконка
               */
              onChange: (value) => {
                let id;
                let item;
                if (!this.getParentView().lockProperties) {
                  id = $$("tree").getSelectedId();
                  item = $$("tree").getItem(id);
                  item.icon = value;
                  $$("tree").updateItem(id, item);
                }
              },
            },
            options: {
              body: {
                data: meta.map((currentValue) => currentValue.name),
                template: "<i class='mdi mdi-#value#'></i> #value#",
                yCount: 12,
              },
            },
          },
          {
            template: "Image",
            type: "section",
            css: "webix_section",
          },
          {
            view: "uploader",
            id: "uploader",
            value: "Upload Image",
            multiple: false,
            autosend: false,
            name: "files",
            link: "bglist",
            accept: "image/png, image/gif, image/jpeg",
            on: {
              /**
               * Загрузчик картинки
               *
               * @param {object} pFile Объект загрузчика картинки
               */
              onBeforeFileAdd: async (pFile) => {
                const file = pFile;
                if (!this.getParentView().lockProperties) {
                  file.file.sname = `${webix.uid()}.${file.name
                    .split(".")
                    .pop()}`;
                  try {
                    await this.app.io.putObject(
                      file.file.sname,
                      file.file.type,
                      file.file
                    );
                    if (this.app) this.image();
                  } catch (err) {
                    if (this.app)
                      webix.message({
                        text: err.message,
                        type: "error",
                      });
                  }
                }
              },
              /**
               * Обработчик удаления картинки
               */
              "files->onAfterDelete": () => {
                this.image();
              },
            },
          },
          {
            view: "list",
            id: "bglist",
            type: "uploader",
            template: "{common.removeIcon()}{common.percent()}#file.sname#",
            autoheight: true,
            borderless: true,
          },
        ],
      },
      {},
    ],
    rules: {
      /**
       * Проверка ссылки
       *
       * @param {string} value Ссылка
       * @returns {boolean} Флаг корректности ссылки
       */
      url: (value) => !value || !/[\s;,?:@&=+$]/.test(value),
    },
  });

  /**
   * Запись имени картинки
   */
  image() {
    const id = $$("tree").getSelectedId();
    const item = $$("tree").getItem(id);
    if (!this.getParentView().lockProperties && item) {
      const image = $$("bglist").getItem($$("bglist").getFirstId());
      if (image && image.file.sname) item.image = image.file.sname;
      else item.image = "";
      $$("tree").updateItem(id, item);
    }
  }
}
