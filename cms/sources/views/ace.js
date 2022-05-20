import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import DOMPurify from "dompurify";
import "../ace";

/**
 * Класс представления редактора исходного кода
 */
export default class AceView extends JetView {
  #config;

  #editor;

  #session;

  #timeoutId = [];

  /**
   * Деструктор
   */
  destroy() {
    if (this.#session) {
      this.#session.removeAllListeners("changeAnnotation");
      this.#session.removeAllListeners("change");
    }
    this.#config = null;
    this.#editor = null;
    this.#session = null;
    this.#timeoutId = null;
  }

  /**
   * Конструктор
   *
   * @param {object} app Объект приложения
   */
  constructor(app) {
    super(app);
    this.#config = {
      view: "ace-editor",
      theme: "tomorrow",
      mode: "html",
    };
  }

  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => this.#config;

  /**
   * Обработчик изменения содержимого с интервальной записью
   */
  aceChange = () => {
    this.#timeoutId.push(
      webix.delay(
        () => {
          this.#timeoutId.pop();
          if (!this.#timeoutId.length)
            $$("tinymce").setValue(DOMPurify.sanitize(this.#editor.getValue()));
        },
        this,
        [],
        1000
      )
    );
  };

  /**
   * Сеттер содержимого
   *
   * @param {string} html Содержимое
   */
  async setValue(html) {
    this.#session.off("change", this.aceChange);
    this.#session.setValue(html, -1);
    this.#session.on("change", this.aceChange);
    this.#editor.resize();
  }

  /**
   * Обработчик готовности представления класса
   */
  async ready() {
    this.#editor = await this.getRoot().getEditor(true);
    if (this.app) {
      this.#session = this.#editor.getSession();
      this.#session.on("changeAnnotation", () => {
        const annotations = this.#session.getAnnotations() || [];
        const len = annotations.length;
        let i = len;
        while (i) {
          i -= 1;
          if (/doctype first\. Expected/.test(annotations[i].text))
            annotations.splice(i, 1);
        }
        if (len > annotations.length) this.#session.setAnnotations(annotations);
      });
      this.#session.setUseWrapMode(true);
    }
  }
}
