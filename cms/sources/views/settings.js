import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";

/**
 * Класс представления настроек
 */
export default class SettingsView extends JetView {
  #config;

  #siteWorker;

  #event = [];

  /**
   * Деструктор
   */
  destroy() {
    if (this.#event)
      this.#event.forEach((event) => event.component.detachEvent(event.id));
    this.#event = null;
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
          view: "form",
          autoheight: false,
          scroll: true,
          elements: [
            {
              template: "Yandex",
              type: "section",
            },
            {
              id: "yandex",
              view: "text",
              placeholder: "Yandex Verification ID",
            },
            {
              id: "metrika",
              view: "text",
              placeholder: "Yandex Metrika ID",
            },
            {
              template: "Google",
              type: "section",
            },
            {
              id: "google",
              view: "text",
              placeholder: "Google Verification ID",
            },
            {
              id: "analytics",
              view: "text",
              placeholder: "Google Analytics ID",
            },
            {
              template: "Icon",
              type: "section",
              css: "webix_section",
            },
            {
              view: "uploader",
              id: "uploader",
              value: "favicon.ico (32x32)",
              multiple: false,
              autosend: false,
              name: "files",
              accept: "image/vnd.microsoft.icon",
            },
            {
              view: "uploader",
              id: "svgUploader",
              value: "icon.svg",
              multiple: false,
              autosend: false,
              name: "files",
              accept: "image/svg+xml",
            },
            {
              view: "uploader",
              id: "pngUploader",
              value: "icon.png (192x192)",
              multiple: false,
              autosend: false,
              name: "files",
              accept: "image/png",
            },
            {
              view: "uploader",
              id: "tileUploader",
              value: "tile.png (558x558)",
              multiple: false,
              autosend: false,
              name: "files",
              accept: "image/png",
            },
            {
              view: "uploader",
              id: "tileWideUploader",
              value: "tile-wide.png (558x270)",
              multiple: false,
              autosend: false,
              name: "files",
              accept: "image/png",
            },
            {},
            {},
          ],
          elementsConfig: {
            labelAlign: "right",
          },
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

  /**
   * Загрузка иконки
   *
   * @param {object} uploader Объект загрузчика файла
   * @param {string} filename Название файла
   */
  doIcon(uploader, filename) {
    uploader.files.data.clearAll();
    uploader.addFile(
      {
        name: filename,
        sname: filename,
      },
      0
    );
    this.#event.push({
      component: uploader,
      id: uploader.attachEvent("onAfterFileAdd", async (pFile) => {
        const file = pFile;
        try {
          await this.app.io.putObject(filename, file.file.type, file.file);
          if (this.app) webix.message("Settings save complete");
        } catch (err) {
          if (this.app)
            webix.message({
              text: err.message,
              type: "error",
            });
        }
      }),
    });
  }

  /**
   * Обработчик готовности представления класса настроек
   */
  async ready() {
    this.doIcon($$("uploader"), "favicon.ico");
    this.doIcon($$("pngUploader"), "icon.png");
    this.doIcon($$("svgUploader"), "icon.svg");
    this.doIcon($$("tileUploader"), "tile.png");
    this.doIcon($$("tileWideUploader"), "tile-wide.png");
    try {
      this.prop = JSON.parse(await this.app.io.getObject("index.json"));
      if (this.app) {
        if (this.prop[0].yandex) $$("yandex").setValue(this.prop[0].yandex);
        if (this.prop[0].google) $$("google").setValue(this.prop[0].google);
        if (this.prop[0].metrika) $$("metrika").setValue(this.prop[0].metrika);
        if (this.prop[0].analytics)
          $$("analytics").setValue(this.prop[0].analytics);
        this.onChange();
      }
    } catch (err) {
      if (this.app) {
        webix.message({
          text: err.message,
          type: "error",
        });
        this.prop = [];
        this.onChange();
      }
    }
  }

  /**
   * Обработчик изменения данных на форме
   */
  onChange() {
    this.#event.push({
      component: $$("yandex"),
      id: $$("yandex").attachEvent("onChange", (value) => {
        this.prop[0].yandex = value;
        this.save();
      }),
    });
    this.#event.push({
      component: $$("google"),
      id: $$("google").attachEvent("onChange", (value) => {
        this.prop[0].google = value;
        this.save();
      }),
    });
    this.#event.push({
      component: $$("metrika"),
      id: $$("metrika").attachEvent("onChange", (value) => {
        this.prop[0].metrika = value;
        this.save();
      }),
    });
    this.#event.push({
      component: $$("analytics"),
      id: $$("analytics").attachEvent("onChange", (value) => {
        this.prop[0].analytics = value;
        this.save();
      }),
    });
  }

  /**
   * Сохранение настроек
   */
  async save() {
    try {
      const lMessage = {
        pAccessKeyId: this.app.io.getAccessKeyId(),
        pSecretAccessKey: this.app.io.getSecretAccessKey(),
        pBucketName: this.app.io.getBucket(),
        pRegion: this.app.io.getRegion(),
        pEndpoint: this.app.io.getEndpoint(),
      };
      await this.app.io.putObject(
        "index.json",
        "application/json",
        webix.ajax().stringify(this.prop)
      );
      if (this.app) webix.message("Settings save complete");
      if (this.#siteWorker) this.#siteWorker.terminate();
      this.#siteWorker = new Worker(
        new URL("../workers/site.js", import.meta.url)
      );
      this.#siteWorker.postMessage(lMessage);
    } catch (err) {
      if (this.app)
        webix.message({
          text: err.message,
          type: "error",
        });
    }
  }
}
