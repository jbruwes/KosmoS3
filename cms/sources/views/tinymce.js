import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import "../tinymce5";
import tinymce from "tinymce";

import contentUiCss from "tinymce/skins/ui/oxide/content.css";
import contentCss from "tinymce/skins/content/default/content.css";

import "@fontsource/arsenal";
import "@fontsource/bad-script";
import "@fontsource/caveat";
import "@fontsource/comfortaa";
import "@fontsource/cormorant-garamond";
import "@fontsource/cormorant-infant";
import "@fontsource/cormorant-sc";
import "@fontsource/cormorant-unicase";
import "@fontsource/cormorant";
import "@fontsource/jura";
import "@fontsource/marck-script";
import "@fontsource/montserrat";
import "@fontsource/montserrat-alternates";
import "@fontsource/open-sans-condensed";
import "@fontsource/open-sans";
import "@fontsource/oswald";
import "@fontsource/pattaya";
import "@fontsource/poiret-one";
import "@fontsource/roboto-condensed";
import "@fontsource/roboto-mono";
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import "@fontsource/rubik-mono-one";
import "@fontsource/rubik";
import "@fontsource/tenor-sans";
import "@fontsource/neucha";

/**
 * TinyMCE
 */
export default class TinymceView extends JetView {
  #tinymce;

  /**
   * Деструктор
   */
  destroy() {
    if (this.#tinymce) {
      this.#tinymce.off("SetContent");
      this.#tinymce.off("Change");
    }
    this.#tinymce = null;
  }

  /**
   * Конфигурация представления
   *
   * @returns {object} Объект конфигурации
   */
  config = () => ({
    id: "tinymce",
    view: "tinymce5-editor",
    config: {
      plugins:
        "preview searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons",
      menubar: "file edit view insert format tools table",
      toolbar:
        "undo redo | rlink | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample | ltr rtl",
      content_css_cors: true,
      content_css: "index.cdn.css,index.css",
      skin: false,
      content_style: `${contentUiCss.toString()}\n${contentCss.toString()}`,
      file_picker_types: "image media file",
      quickbars_insert_toolbar: "template",
      toolbar_mode: "sliding",
      body_class: "pa-2 ma-0",
      // custom_elements: "v-card-single-k3",
      /**
       * Чтобы не сжирались пустые элементы
       *
       *  @see https://www.tiny.cloud/docs-3x/reference/Configuration3x/Configuration3x@valid_elements/#fullxhtmlruleset
       */
      /* extended_valid_elements:
        "a[accesskey|charset|class|coords|dir<ltr?rtl|href|hreflang|id|lang|name" +
        "|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup" +
        "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|rel|rev" +
        "|shape<circle?default?poly?rect|style|tabindex|title|target|type]," +
        "div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick" +
        "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" +
        "|onmouseout|onmouseover|onmouseup|style|title]," +
        "em[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress" +
        "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style" +
        "|title]," +
        "i[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress" +
        "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style" +
        "|title]," +
        "span[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown" +
        "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover" +
        "|onmouseup|style|title]", */
      valid_elements: "*[*]",
      protect: [/<v-.+(<\/v-.+?>)/g],
      branding: false,
      browser_spellcheck: true,
      convert_urls: false,
      image_advtab: true,
      image_caption: true,
      image_title: true,
      images_reuse_filename: true,
      relative_urls: false,
      remove_script_host: false,
      document_base_url: `${this.app.io.getWendpoint()}/${this.app.io.getBucket()}/`,
      statusbar: false,
      resize: false,
      promotion: false,
      templates: [
        {
          title: "breadcrumbs",
          description: "v-breadcrumbs-k3",
          content: '<v-breadcrumbs-k3></v-breadcrumbs-k3>',
        },
        {
          title: "carousel banner",
          description: "v-carousel-banner-k3",
          content: '<v-carousel-banner-k3></v-carousel-banner-k3>',
        },
        {
          title: "grid card",
          description: "v-grid-card-k3",
          content: '<v-grid-card-k3></v-grid-card-k3>',
        },
        {
          title: "grid icon",
          description: "v-grid-icon-k3",
          content: '<v-grid-icon-k3></v-grid-icon-k3>',
        },
        {
          title: "list item",
          description: "v-list-item-k3",
          content: '<v-list-item-k3></v-list-item-k3>',
        },
        {
          title: "pagination",
          description: "v-pagination-k3",
          content: '<v-pagination-k3></v-pagination-k3>',
        },
        {
          title: "parent button",
          description: "v-parent-button-k3",
          content: '<v-parent-button-k3></v-parent-button-k3>',
        },
        {
          title: "single banner",
          description: "v-single-banner-k3",
          content: '<v-single-banner-k3></v-single-banner-k3>',
        },
        {
          title: "single banner birds",
          description: "v-single-banner-birds-k3",
          content: '<v-single-banner-birds-k3></v-single-banner-birds-k3>',
        },
        {
          title: "single banner cells",
          description: "v-single-banner-cells-k3",
          content: '<v-single-banner-cells-k3></v-single-banner-cells-k3>',
        },
        {
          title: "single banner clouds",
          description: "v-single-banner-clouds-k3",
          content: '<v-single-banner-clouds-k3></v-single-banner-clouds-k3>',
        },
        {
          title: "single banner clouds2",
          description: "v-single-banner-clouds2-k3",
          content: '<v-single-banner-clouds2-k3></v-single-banner-clouds2-k3>',
        },
        {
          title: "single banner dots",
          description: "v-single-banner-dots-k3",
          content: '<v-single-banner-dots-k3></v-single-banner-dots-k3>',
        },
        {
          title: "single banner fog",
          description: "v-single-banner-fog-k3",
          content: '<v-single-banner-fog-k3></v-single-banner-fog-k3>',
        },
        {
          title: "single banner globe",
          description: "v-single-banner-globe-k3",
          content: '<v-single-banner-globe-k3></v-single-banner-globe-k3>',
        },
        {
          title: "single banner halo",
          description: "v-single-banner-halo-k3",
          content: '<v-single-banner-halo-k3></v-single-banner-halo-k3>',
        },
        {
          title: "single banner net",
          description: "v-single-banner-net-k3",
          content: '<v-single-banner-net-k3></v-single-banner-net-k3>',
        },
        {
          title: "single banner rings",
          description: "v-single-banner-rings-k3",
          content: '<v-single-banner-rings-k3></v-single-banner-rings-k3>',
        },
        {
          title: "single banner ripple",
          description: "v-single-banner-ripple-k3",
          content: '<v-single-banner-ripple-k3></v-single-banner-ripple-k3>',
        },
        {
          title: "single banner topology",
          description: "v-single-banner-topology-k3",
          content: '<v-single-banner-topology-k3></v-single-banner-topology-k3>',
        },
        {
          title: "single banner trunk",
          description: "v-single-banner-trunk-k3",
          content: '<v-single-banner-trunk-k3></v-single-banner-trunk-k3>',
        },
        {
          title: "single banner waves",
          description: "v-single-banner-waves-k3",
          content: '<v-single-banner-waves-k3></v-single-banner-waves-k3>',
        },
        {
          title: "single button",
          description: "v-single-button-k3",
          content: '<v-single-button-k3></v-single-button-k3>',
        },
        {
          title: "single card",
          description: "v-single-card-k3",
          content: '<v-single-card-k3></v-single-card-k3>',
        },
        {
          title: "single header",
          description: "v-single-header-k3",
          content: '<v-single-header-k3></v-single-header-k3>',
        },
        {
          title: "single icon",
          description: "v-single-icon-k3",
          content:
            '<v-single-icon-k3></v-single-icon-k3>',
        },
        {
          title: "single item",
          description: "v-single-item-k3",
          content:
            '<v-single-item-k3></v-single-item-k3>',
        },
        {
          title: "slide card",
          description: "v-slide-card-k3",
          content: '<v-slide-card-k3></v-slide-card-k3>',
        },
        {
          title: "slide icon",
          description: "v-slide-icon-k3",
          content: '<v-slide-icon-k3></v-slide-icon-k3>',
        },
      ],
      font_family_formats:
        "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats" +
        ";" +
        'Arsenal="Arsenal";' +
        'Bad Script="Bad Script";' +
        'Caveat="Caveat";' +
        'Comfortaa="Comfortaa";' +
        'Cormorant Garamond="Cormorant Garamond";' +
        'Cormorant Infant="Cormorant Infant";' +
        'Cormorant SC="Cormorant SC";' +
        'Cormorant Unicase="Cormorant Unicase";' +
        'Cormorant="Cormorant";' +
        'Jura="Jura";' +
        'Marck Script="Marck Script";' +
        'Montserrat="Montserrat";' +
        'Montserrat Alternates="Montserrat Alternates";' +
        'Neucha="Neucha";' +
        'Open Sans Condensed="Open Sans Condensed";' +
        'Open Sans="Open Sans";' +
        'Oswald="Oswald";' +
        'Pattaya="Pattaya";' +
        'Poiret One="Poiret One";' +
        'Roboto Condensed="Roboto Condensed";' +
        'Roboto Mono="Roboto Mono";' +
        'Roboto Slab="Roboto Slab";' +
        'Roboto="Roboto";' +
        'Rubik Mono One="Rubik Mono One";' +
        'Rubik="Rubik";' +
        'Tenor Sans="Tenor Sans";',
      /**
       * Начальная установка TinyMCE
       *
       * @param {object} editor Текущий инстанс
       */
      setup: (editor) => {
        if (
          !$$("sidebar").getSelectedItem() ||
          $$("sidebar").getSelectedItem().id === "content"
        ) {
          editor.ui.registry.addMenuButton("rlink", {
            icon: "link",
            tooltip: "Insert/edit link",
            /**
             * Дерево ссылок
             *
             * @param {Function} callback Колбек функция
             */
            fetch: (callback) => {
              const item = $$("tree").getFirstId();
              if (item) callback(this.getSubmenuItems(item, ""));
            },
          });
        }
      },
      /**
       * Обработчик по нажатию кнопки выбора файла
       *
       * @param {Function} cb Колбек функция
       */
      file_picker_callback: (cb) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*,video/*");
        /**
         * Обработчик по загрузке файла
         */
        input.onchange = () => {
          const file = input.files[0];
          const reader = new FileReader();
          /**
           * Запись на S3
           */
          reader.onload = async () => {
            const id = `blobid${webix.uid()}`;
            const { blobCache } = tinymce.activeEditor.editorUpload;
            const base64 = reader.result.split(",")[1];
            const blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            const filePath = `${webix.uid()}.${decodeURI(file.name)
              .split(".")
              .pop()}`;
            try {
              await this.app.io.putObject(filePath, file.type, blobInfo.blob());
              if (this.app) cb(filePath, { alt: decodeURI(file.name) });
            } catch (err) {
              if (this.app)
                webix.message({
                  text: err.message,
                  type: "error",
                });
            }
          };
          reader.readAsDataURL(file);
        };
        input.click();
      },
      /**
       * Обработчик на форму загрузки файла
       *
       * @param {object} blobInfo Мета объект загруженного файла
       */
      images_upload_handler: async (blobInfo) => {
        const filePath = `${webix.uid()}.${decodeURI(blobInfo.filename())
          .split(".")
          .pop()}`;
        try {
          await this.app.io.putObject(
            filePath,
            blobInfo.blob().type,
            blobInfo.blob()
          );
        } catch (err) {
          if (this.app) throw err;
        }
        return filePath;
      },
      link_class_list: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Default Button",
          value: "ui icon button",
        },
        {
          title: "Primary Button",
          value: "ui icon primary button",
        },
        {
          title: "Secondary Button",
          value: "ui icon secondary button",
        },
        {
          title: "Positive Button",
          value: "ui icon positive button",
        },
        {
          title: "Negative Button",
          value: "ui icon negative button",
        },
        {
          title: "Default Basic Button",
          value: "ui icon basic button",
        },
        {
          title: "Primary Basic Button",
          value: "ui icon basic primary button",
        },
        {
          title: "Secondary Basic Button",
          value: "ui icon basic secondary button",
        },
        {
          title: "Positive Basic Button",
          value: "ui icon basic positive button",
        },
        {
          title: "Negative Basic Button",
          value: "ui icon basic negative button",
        },
      ],
      image_class_list: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Bordered",
          value: "ui bordered image",
        },
        {
          title: "Circular",
          value: "ui circular image",
        },
        {
          title: "Rounded",
          value: "ui rounded image",
        },
      ],
      table_class_list: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Default",
          value: "ui celled striped selectable table",
        },
        {
          title: "Red",
          value: "ui celled striped selectable red table",
        },
        {
          title: "Orange",
          value: "ui celled striped selectable orange table",
        },
        {
          title: "Yellow",
          value: "ui celled striped selectable yellow table",
        },
        {
          title: "Olive",
          value: "ui celled striped selectable olive table",
        },
        {
          title: "Green",
          value: "ui celled striped selectable green table",
        },
        {
          title: "Teal",
          value: "ui celled striped selectable teal table",
        },
        {
          title: "Blue",
          value: "ui celled striped selectable blue table",
        },
        {
          title: "Violet",
          value: "ui celled striped selectable violet table",
        },
        {
          title: "Purple",
          value: "ui celled striped selectable purple table",
        },
        {
          title: "Pink",
          value: "ui celled striped selectable pink table",
        },
        {
          title: "Grey",
          value: "ui celled striped selectable grey table",
        },
        {
          title: "Black",
          value: "ui celled striped selectable black table",
        },
      ],
      table_cell_class_list: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Positive",
          value: "positive",
        },
        {
          title: "Negative",
          value: "negative",
        },
        {
          title: "Error",
          value: "error",
        },
        {
          title: "Warning",
          value: "warning",
        },
        {
          title: "Active",
          value: "active",
        },
        {
          title: "Disabled",
          value: "disabled",
        },
      ],
      table_row_class_list: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Positive",
          value: "positive",
        },
        {
          title: "Negative",
          value: "negative",
        },
        {
          title: "Error",
          value: "error",
        },
        {
          title: "Warning",
          value: "warning",
        },
        {
          title: "Active",
          value: "active",
        },
        {
          title: "Disabled",
          value: "disabled",
        },
      ],
    },
  });

  /**
   * По готовности представления
   */
  async ready() {
    this.#tinymce = await $$("tinymce").getEditor(true);
    if (this.app) {
      this.#tinymce.on("Change", this.save);
      this.#tinymce.dom.loadCSS(
        `${Object.values(
          await (
            await fetch("assets-manifest.json", { cache: "no-store" })
          ).json()
        )
          .filter((element) => /.\.css$/.test(element))
          .map((element) => `${window.location.origin}/${element}`)
          .join(",")}`
      );
    }
  }

  /**
   * Формирование дерева ссылок
   *
   * @param {string} pId Идентификатоп
   * @param {string} pPath Путь
   * @returns {object} Дерево ссылок
   */
  getSubmenuItems(pId, pPath) {
    /**
     * Вставка ссылки
     *
     * @param {object} that Объект текущей ссылки
     */
    function onAction(that) {
      if (tinymce.activeEditor.selection.getContent() === "")
        tinymce.execCommand(
          "mceInsertContent",
          !1,
          `<a href="${that.path}/${that.text.replace(/ /g, "_")}/">${
            that.text
          }</a>`
        );
      else
        tinymce.execCommand(
          "mceInsertLink",
          !1,
          `${that.path}/${that.text.replace(/ /g, "_")}/`
        );
    }

    let lId = $$("tree").getFirstChildId(pId);
    const items = [];
    while (lId) {
      const item = $$("tree").getItem(lId);
      const lItem = {
        type: "menuitem",
        text: item.value.replace(/[""]/g, '\\"'),
        path: pPath,
        /**
         * Функия вызова обработчика вставки ссылки
         */
        onAction: () => {
          onAction(lItem);
        },
      };
      if ($$("tree").getFirstChildId(lId)) {
        lItem.icon = "chevron-right";
        /**
         * Вызов формирования подуровня ссылок
         *
         * @returns {object} Подуровень ссылок
         */
        lItem.getSubmenuItems = () =>
          this.getSubmenuItems(
            item.id,
            `${pPath}/${item.value.replace(/ /g, "_")}`
          );
      } else lItem.icon = "link";
      items.push(lItem);
      lId = $$("tree").getNextSiblingId(lId);
    }
    return items;
  }

  /**
   * Загрузка контента в TinyMCE
   *
   * @param {string} val Контент
   */
  setValue(val) {
    this.#tinymce.off("SetContent");
    this.#tinymce.off("Change");
    this.#tinymce.getWin().scrollTo(0, 0);
    this.#tinymce.setContent(val);
    this.#tinymce.undoManager.clear();
    this.#tinymce.nodeChanged();
    this.#tinymce.on("Change", this.save);
    this.#tinymce.on("SetContent", this.save);
  }

  /**
   * Запись контента на S3
   */
  save = () => {
    this.getParentView().save.call(this.getParentView());
  };
}
