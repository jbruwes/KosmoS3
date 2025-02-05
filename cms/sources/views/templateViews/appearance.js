import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";

/**
 * Класс параметров представления
 */
export default class AppearanceView extends JetView {
  /**
   * Конфигурация
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    view: "form",
    scroll: true,
    elements: [
      {
        template: "Padding",
        type: "section",
        css: "webix_section",
      },
      {
        view: "text",
        id: "paddingLeft",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-left'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "paddingRight",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-right'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "paddingTop",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-up'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "paddingBottom",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-down'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },

      {
        template: "Border",
        type: "section",
        css: "webix_section",
      },
      {
        view: "richselect",
        value: "none",
        id: "borderLeftStyle",
        options: [
          {
            id: "none",
            value: "none",
          },
          {
            id: "solid",
            value: "solid",
          },
          {
            id: "dotted",
            value: "dotted",
          },
          {
            id: "dashed",
            value: "dashed",
          },
          {
            id: "double",
            value: "double",
          },
          {
            id: "groove",
            value: "groove",
          },
          {
            id: "ridge",
            value: "ridge",
          },
          {
            id: "inset",
            value: "inset",
          },
          {
            id: "outset",
            value: "outset",
          },
        ],
        label:
          "<span class='mdi mdi-dark mdi-24px mdi-border-left-variant'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "borderLeftWidth",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-horizontal'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "colorpicker",
        id: "borderLeftColor",
        value: "#000000",
        label: "<span class='mdi mdi-dark mdi-24px mdi-palette'></span>",
        labelWidth: 33,
        editable: true,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "slider",
        type: "alt",
        id: "borderLeftTransparency",
        value: "100",
        min: 0,
        max: 100,
        label: '<span class="mdi mdi-dark mdi-24px mdi-opacity"></span>',
        labelWidth: 33,
        title: webix.template("#value#"),
        on: {
          onChange: this.onChange,
        },
      },
      {
        height: 8,
      },
      {
        view: "richselect",
        value: "none",
        id: "borderRightStyle",
        options: [
          {
            id: "none",
            value: "none",
          },
          {
            id: "solid",
            value: "solid",
          },
          {
            id: "dotted",
            value: "dotted",
          },
          {
            id: "dashed",
            value: "dashed",
          },
          {
            id: "double",
            value: "double",
          },
          {
            id: "groove",
            value: "groove",
          },
          {
            id: "ridge",
            value: "ridge",
          },
          {
            id: "inset",
            value: "inset",
          },
          {
            id: "outset",
            value: "outset",
          },
        ],
        label:
          "<span class='mdi mdi-dark mdi-24px mdi-border-right-variant'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "borderRightWidth",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-horizontal'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "colorpicker",
        id: "borderRightColor",
        value: "#000000",
        label: "<span class='mdi mdi-dark mdi-24px mdi-palette'></span>",
        labelWidth: 33,
        editable: true,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "slider",
        type: "alt",
        id: "borderRightTransparency",
        value: "100",
        min: 0,
        max: 100,
        label: '<span class="mdi mdi-dark mdi-24px mdi-opacity"></span>',
        labelWidth: 33,
        title: webix.template("#value#"),
        on: {
          onChange: this.onChange,
        },
      },
      {
        height: 8,
      },
      {
        view: "richselect",
        value: "none",
        id: "borderTopStyle",
        options: [
          {
            id: "none",
            value: "none",
          },
          {
            id: "solid",
            value: "solid",
          },
          {
            id: "dotted",
            value: "dotted",
          },
          {
            id: "dashed",
            value: "dashed",
          },
          {
            id: "double",
            value: "double",
          },
          {
            id: "groove",
            value: "groove",
          },
          {
            id: "ridge",
            value: "ridge",
          },
          {
            id: "inset",
            value: "inset",
          },
          {
            id: "outset",
            value: "outset",
          },
        ],
        label:
          "<span class='mdi mdi-dark mdi-24px mdi-border-top-variant'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "borderTopWidth",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-horizontal'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "colorpicker",
        id: "borderTopColor",
        value: "#000000",
        label: "<span class='mdi mdi-dark mdi-24px mdi-palette'></span>",
        labelWidth: 33,
        editable: true,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "slider",
        type: "alt",
        id: "borderTopTransparency",
        value: "100",
        min: 0,
        max: 100,
        label: '<span class="mdi mdi-dark mdi-24px mdi-opacity"></span>',
        labelWidth: 33,
        title: webix.template("#value#"),
        on: {
          onChange: this.onChange,
        },
      },
      {
        height: 8,
      },
      {
        view: "richselect",
        value: "none",
        id: "borderBottomStyle",
        options: [
          {
            id: "none",
            value: "none",
          },
          {
            id: "solid",
            value: "solid",
          },
          {
            id: "dotted",
            value: "dotted",
          },
          {
            id: "dashed",
            value: "dashed",
          },
          {
            id: "double",
            value: "double",
          },
          {
            id: "groove",
            value: "groove",
          },
          {
            id: "ridge",
            value: "ridge",
          },
          {
            id: "inset",
            value: "inset",
          },
          {
            id: "outset",
            value: "outset",
          },
        ],
        label:
          "<span class='mdi mdi-dark mdi-24px mdi-border-bottom-variant'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "borderBottomWidth",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-horizontal'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "colorpicker",
        id: "borderBottomColor",
        value: "#000000",
        label: "<span class='mdi mdi-dark mdi-24px mdi-palette'></span>",
        labelWidth: 33,
        editable: true,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "slider",
        type: "alt",
        id: "borderBottomTransparency",
        value: "100",
        min: 0,
        max: 100,
        label: '<span class="mdi mdi-dark mdi-24px mdi-opacity"></span>',
        labelWidth: 33,
        title: webix.template("#value#"),
        on: {
          onChange: this.onChange,
        },
      },

      {
        template: "Corner Radius",
        type: "section",
        css: "webix_section",
      },
      {
        view: "text",
        id: "borderTopLeftRadius",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-top-left'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "borderTopRightRadius",
        type: "number",
        label: "<span class='mdi mdi-dark mdi-24px mdi-pan-top-right'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "borderBottomLeftRadius",
        type: "number",
        label:
          "<span class='mdi mdi-dark mdi-24px mdi-pan-bottom-left'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "text",
        id: "borderBottomRightRadius",
        type: "number",
        label:
          "<span class='mdi mdi-dark mdi-24px mdi-pan-bottom-right'></span>",
        labelWidth: 33,
        on: {
          onChange: this.onChange,
        },
      },

      {
        template: "Text",
        type: "section",
        css: "webix_section",
      },
      {
        view: "colorpicker",
        id: "textColor",
        value: "#000000",
        label: "<span class='mdi mdi-dark mdi-24px mdi-palette'></span>",
        labelWidth: 33,
        editable: true,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "slider",
        type: "alt",
        id: "textTransparency",
        value: "100",
        min: 0,
        max: 100,
        label: '<span class="mdi mdi-dark mdi-24px mdi-opacity"></span>',
        labelWidth: 33,
        title: webix.template("#value#"),
        on: {
          onChange: this.onChange,
        },
      },
      {
        template: "Background",
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
           * @param pFile
           */
          onBeforeFileAdd: this.onBeforeFileAdd,
          "files->onAfterDelete": this.onChange,
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

      {
        id: "attachment",
        view: "segmented",
        value: "scroll",
        options: ["scroll", "fixed", "local"],
        on: {
          onChange: this.onChange,
        },
      },
      {
        id: "backgroundSize",
        view: "segmented",
        value: "auto",
        options: ["auto", "cover", "contain"],
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "colorpicker",
        id: "backgroundColor",
        value: "#000000",
        label: "<span class='mdi mdi-dark mdi-24px mdi-palette'></span>",
        labelWidth: 33,
        editable: true,
        on: {
          onChange: this.onChange,
        },
      },
      {
        view: "slider",
        type: "alt",
        id: "backgroundTransparency",
        value: "100",
        min: 0,
        max: 100,
        label: '<span class="mdi mdi-dark mdi-24px mdi-opacity"></span>',
        labelWidth: 33,
        title: webix.template("#value#"),
        on: {
          onChange: this.onChange,
        },
      },
      {
        height: 8,
      },
      {
        view: "flexlayout",
        cols: [
          {
            id: "repeat-x",
            minWidth: 90,
            view: "radio",
            label:
              "<span class='mdi mdi-dark mdi-24px mdi-reorder-vertical'></span>",
            labelPosition: "top",
            vertical: true,
            value: "repeat",
            options: ["no-repeat", "repeat", "round", "space"],
            on: {
              onChange: this.onChange,
            },
          },
          {
            id: "repeat-y",
            minWidth: 90,
            view: "radio",
            label:
              "<span class='mdi mdi-dark mdi-24px mdi-reorder-horizontal'></span>",
            labelPosition: "top",
            vertical: true,
            value: "repeat",
            options: ["no-repeat", "repeat", "round", "space"],
            on: {
              onChange: this.onChange,
            },
          },
          {
            view: "radio",
            minWidth: 150,
            id: "backgroundPosition",
            value: "0% 0%",
            label: "<span class='mdi mdi-dark mdi-24px mdi-pan'></span>",
            labelPosition: "top",
            on: {
              onChange: this.onChange,
            },
            options: [
              {
                id: "0% 0%",
                value: "",
              },
              {
                id: "50% 0%",
                value: "",
              },
              {
                id: "100% 0%",
                value: "",
              },
              {
                id: "0% 50%",
                value: "",
                newline: true,
              },
              {
                id: "50% 50%",
                value: "",
              },
              {
                id: "100% 50%",
                value: "",
              },
              {
                id: "0% 100%",
                value: "",
                newline: true,
              },
              {
                id: "50% 100%",
                value: "",
              },
              {
                id: "100% 100%",
                value: "",
              },
            ],
          },
        ],
      },
      {
        height: 8,
      },
      {
        template: "Opacity",
        type: "section",
        css: "webix_section",
      },
      {
        view: "slider",
        type: "alt",
        id: "transparency",
        value: "100",
        min: 0,
        max: 100,
        label: '<span class="mdi mdi-dark mdi-24px mdi-opacity"></span>',
        labelWidth: 33,
        title: webix.template("#value#"),
        on: {
          onChange: this.onChange,
        },
      },
      {},
    ],
  });

  /**
   * Перерисовка на изменение полей
   */
  onChange = () => {
    const parentView = this.getParentView();
    parentView.redraw.call(parentView);
  };

  /**
   * Загрузка картинки
   *
   * @param {object} pFile Объект загружаемой картинки
   */
  onBeforeFileAdd = async (pFile) => {
    const file = pFile;
    if (!this.getParentView().lockRedraw) {
      file.file.sname = `${webix.uid()}.${file.name.split(".").pop()}`;
      try {
        await this.app.io.putObject(file.file.sname, file.file.type, file.file);
        if (this.app) this.onChange();
      } catch (err) {
        if (this.app)
          webix.message({
            text: err.message,
            type: "error",
          });
      }
    }
  };
}
