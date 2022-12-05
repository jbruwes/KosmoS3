import * as webix from "webix/webix.min";

/* Import TinyMCE */
import tinymce from "tinymce";

/* Default icons are required for TinyMCE 5.3 or above */
import "tinymce/icons/default";

/* A theme is also required */
import "tinymce/themes/silver";

/* Import the skin */
import "tinymce/skins/ui/oxide/skin.css";

/* Import plugins */
import "tinymce/plugins/preview";
import "tinymce/plugins/importcss";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/save";
import "tinymce/plugins/directionality";
import "tinymce/plugins/code";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/media";
import "tinymce/plugins/template";
import "tinymce/plugins/codesample";
import "tinymce/plugins/table";
import "tinymce/plugins/charmap";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/anchor";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/advlist";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";

import "tinymce/models/dom";

webix.protoUI(
  {
    name: "tinymce5-editor",
    defaults: {
      config: { theme: "silver", statusbar: false },
      value: "",
    },
    /**
     * Инициализация
     */
    $init() {
      webix.html.addStyle(".tox-tinymce{ border:0px !important}");

      this.mce_id = `webix_mce_${this.config.id || webix.uid()}`;
      this.$view.innerHTML = `<textarea id='${this.mce_id}' style='border:none;outline:none;width:100%;height:100%'></textarea>`;

      this.waitEditor = webix.promise.defer();

      this.$ready.push(this.require_tinymce_once);
    },
    /**
     * Отрисовка
     */
    render() {
      this.set_inner_size();
    },
    /**
     * По инициализации
     */
    require_tinymce_once() {
      if (!tinymce.dom.Event.domLoaded) {
        // woraround event logic in tinymce
        tinymce.dom.Event.domLoaded = true;
      }

      const editorConfig = webix.copy(this.config.config || {});
      webix.extend(
        editorConfig,
        {
          selector: `#${this.mce_id}`,
          resize: false,
        },
        true
      );

      const customSetup = editorConfig.setup;
      editorConfig.setup = webix.bind(function webixBind(editor) {
        if (customSetup) {
          customSetup(editor);
        }
        editor.on("init", webix.bind(this.mce_editor_ready, this), true);
      }, this);

      webix.delay(function webixDelay() {
        tinymce.init(editorConfig);
      }, this);
    },
    /**
     * По готовности
     *
     * @param {object} event Событие
     */
    mce_editor_ready(event) {
      this.editor = event.target;

      this.setValue(this.config.value);
      this.set_inner_size();
      this.waitEditor.resolve(this.editor);
    },
    /**
     * Установка внутреннего размера
     */
    set_inner_size() {
      if (this.editor) {
        this.$view.querySelector(
          ".tox-tinymce"
        ).style.height = `${this.$height}px`;
      }
    },
    /**
     * Установка размера
     *
     * @param {number} x Ширина
     * @param {number} y Высота
     */
    $setSize(x, y) {
      if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
        this.set_inner_size();
      }
    },
    /**
     * Установка содержимого
     *
     * @param {string} value Содержимое
     */
    setValue(value) {
      this.config.value = value;
      this.waitEditor.then(function onWaitEditor(editor) {
        editor.setContent(value);
      });
    },
    /**
     * Получение содержимого
     *
     * @returns {string} Содержимое
     */
    getValue() {
      return this.editor ? this.editor.getContent() : this.config.value;
    },
    /**
     * Установка фокуса
     */
    focus() {
      this.waitEditor.then(function onWaitEditor(editor) {
        editor.focus();
      });
    },
    /**
     * Получение редактора
     *
     * @param {boolean} wait Флаг ожидания
     * @returns {object} Редактор
     */
    getEditor(wait) {
      return wait ? this.waitEditor : this.editor;
    },
  },
  webix.ui.view
);
