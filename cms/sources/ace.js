import * as webix from "webix/webix.min";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/webpack-resolver";

webix.protoUI(
  {
    name: "ace-editor",
    defaults: {
      mode: "javascript",
      theme: "monokai",
    },
    /**
     * Инициализация
     */
    $init() {
      this.$view.innerHTML = "<div style='width:100%;height:100%'></div>";
      this.waitEditor = webix.promise.defer();
      this.$ready.push(this.render_cm_editor);
    },
    /**
     * Установка размера
     *
     * @param {number} w Ширина
     * @param {number} h Высота
     */
    $setSize(w, h) {
      if (webix.ui.view.prototype.$setSize.call(this, w, h)) {
        if (this.editor) {
          this.editor.resize();
        }
      }
    },
    /**
     * Отрисовка
     */
    render_cm_editor() {
      this.editor = ace.edit(this.$view.firstChild);

      this.editor.$blockScrolling = Infinity;
      this.editor.setOptions({
        fontFamily: "consolas,monospace",
        fontSize: "12pt",
      });

      if (this.config.theme) {
        this.editor.setTheme(`ace/theme/${this.config.theme}`);
      }
      if (this.config.mode) {
        this.editor.getSession().setMode(`ace/mode/${this.config.mode}`);
      }
      if (this.config.value) {
        this.setValue(this.config.value);
      }
      if (this.focus_await) {
        this.focus();
      }

      this.editor.navigateFileStart();
      this.waitEditor.resolve(this.editor);
    },
    /**
     * Установка содержимого
     *
     * @param {string} pValue Содержимое
     */
    setValue(pValue) {
      let value = pValue;
      if (!value && value !== 0) {
        value = "";
      }

      this.config.value = value;
      if (this.editor) {
        this.editor.setValue(value);
      }
    },
    /**
     * Получение содержимого
     *
     * @returns {string} Содержимое
     */
    getValue() {
      return this.editor ? this.editor.getValue() : this.config.value;
    },
    /**
     * Установка фокуса
     */
    focus() {
      this.focus_await = true;
      if (this.editor) {
        this.editor.focus();
      }
    },
    /**
     * Получение редактора
     *
     * @param {boolean} waitEditor Флаг ожидания
     * @returns {object} Редактор
     */
    getEditor(waitEditor) {
      return waitEditor ? this.waitEditor : this.editor;
    },
  },
  webix.ui.view
);
