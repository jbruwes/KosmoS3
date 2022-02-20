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
     *
     */
    $init() {
      this.$view.innerHTML = "<div style='width:100%;height:100%'></div>";
      this.waitEditor = webix.promise.defer();
      this.$ready.push(this.render_cm_editor);
    },
    /**
     * @param w
     * @param h
     */
    $setSize(w, h) {
      if (webix.ui.view.prototype.$setSize.call(this, w, h)) {
        if (this.editor) {
          this.editor.resize();
        }
      }
    },
    /**
     *
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
     * @param pValue
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
     *
     */
    getValue() {
      return this.editor ? this.editor.getValue() : this.config.value;
    },
    /**
     *
     */
    focus() {
      this.focus_await = true;
      if (this.editor) {
        this.editor.focus();
      }
    },
    /**
     * @param waitEditor
     */
    getEditor(waitEditor) {
      return waitEditor ? this.waitEditor : this.editor;
    },
  },
  webix.ui.view
);
