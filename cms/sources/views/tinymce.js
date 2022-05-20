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

  #itemsTemplate;

  #grid;

  #segments;

  #header;

  #dimmedImage;

  #commonData;

  #singleData;

  #multiData;

  #sliderData;

  /**
   * Деструктор
   */
  destroy() {
    if (this.#tinymce) {
      this.#tinymce.off("SetContent");
      this.#tinymce.off("Change");
    }
    this.#tinymce = null;
    this.#itemsTemplate = null;
    this.#grid = null;
    this.#segments = null;
    this.#header = null;
    this.#dimmedImage = null;
    this.#commonData = null;
    this.#singleData = null;
    this.#multiData = null;
    this.#sliderData = null;
  }

  /**
   * Коструктор
   *
   * @param {object} app Приложение
   */
  constructor(app) {
    super(app);
    this.#itemsTemplate =
      '<div class="ui items mceNonEditable" #{data}>' +
      '<div class="item">#{content}</div>' +
      "</div>";
    this.#grid =
      '<div class="' +
      "ui #{count} column #{centered} stretched padded grid #{editable} " +
      "#{adaptive}" +
      '" #{data}>' +
      "#{divider}" +
      '<div class="column #{align}" data-aos="#{aos}">#{content}</div>' +
      "</div>";
    this.#segments =
      '<div class="' +
      "ui vertical padded basic segments mceNonEditable" +
      '" #{data}>' +
      "#{content}" +
      "</div>";
    this.#header =
      '<div class="content">' +
      '<a class="ui header hvr-icon-wobble-vertical">' +
      '<i class="hvr-icon icon"><!-- --></i>' +
      '<span class="ui">' +
      '<span class="sub header"><!-- --></span>' +
      "</span></a></div>";
    this.#dimmedImage =
      '<div class="ui #{size} image">' +
      '<div class="ui inverted dimmer">' +
      '<a class="ui circular inverted secondary icon button">' +
      '<i class="icon"><!-- --></i>' +
      '</a></div><img class="ui image" loading="#{loading}"></div>';
    this.#commonData = 'data-auto="" data-path=""';
    this.#singleData = 'data-description="true" data-date="true"';
    this.#multiData =
      'data-length="" ' +
      'data-deep="false" ' +
      'data-reveal="true" ' +
      'data-sort="false" ' +
      'data-children=""';
    this.#sliderData = 'data-pager="true" data-controls="true"';
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
      content_style: `${contentUiCss.toString()}\n${contentCss.toString()}\n.mce-content-body{margin:0;padding:8px;}`,
      file_picker_types: "image media file",
      quickbars_insert_toolbar: "template",
      toolbar_mode: "sliding",
      /**
       * Чтобы не сжирались пустые элементы
       *
       *  @see https://www.tiny.cloud/docs-3x/reference/Configuration3x/Configuration3x@valid_elements/#fullxhtmlruleset
       */
      extended_valid_elements:
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
        "|onmouseup|style|title]",
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
      templates: [
        {
          title: "menu",
          description:
            "data-scrollable " +
            "data-animation " +
            "data-close-on-click " +
            "data-direction " +
            "data-hover-delay " +
            "data-open-on-click " +
            "data-orientation " +
            "data-popup-collision",
          content:
            "<div" +
            " " +
            'class="mceNonEditable"' +
            " " +
            'data-id="rmenu"' +
            " " +
            'data-scrollable="true"' +
            " " +
            'data-animation="true"' +
            " " +
            'data-close-on-click="true"' +
            " " +
            'data-direction="default"' +
            " " +
            'data-hover-delay="100"' +
            " " +
            'data-open-on-click="false"' +
            " " +
            'data-orientation="horizontal"' +
            " " +
            'data-popup-collision="true"' +
            "></div>",
        },
        {
          title: "deck",
          description: "колода карточек",
          content: this.#grid
            .replace("#{divider}", "")
            .replace("#{centered}", "centered")
            .replace("#{editable}", "mceNonEditable")
            .replace("#{count}", "three")
            .replace("#{aos}", "flip-left")
            .replace("#{align}", "")
            .replace("#{adaptive}", "")
            .replace(
              "#{data}",
              [
                'data-id="deck"',
                this.#commonData,
                this.#singleData,
                this.#multiData,
                this.#sliderData,
              ].join(" ")
            )
            .replace(
              "#{content}",
              `<div class="ui fluid raised link card">${this.#dimmedImage
                .replace("#{loading}", "eager")
                .replace("#{size}", "")}${this.#header}</div>`
            ),
        },
        {
          title: "carousel",
          description: "слайдер",
          content: this.#segments
            .replace(
              "#{data}",
              [
                'data-id="carousel"',
                this.#commonData,
                this.#singleData,
                this.#multiData,
                this.#sliderData,
              ].join(" ")
            )
            .replace(
              "#{content}",
              `${
                "<div" +
                " " +
                'class="ui basic fitted segment jarallax"' +
                " " +
                'style="min-height:100vh;"' +
                ">" +
                '<div class="ui active very light dimmer">'
              }${this.#header}</div></div>`
            ),
        },
        {
          title: "pageheader",
          description: "заголовок с картинкой на подложке",
          content:
            `${
              '<div class="' +
              "ui basic vertical fitted segment jarallax mceNonEditable" +
              '"' +
              " "
            }${[
              'data-id="pageheader"',
              this.#commonData,
              this.#singleData,
            ].join(" ")} ` +
            `style="min-height:100vh;">` +
            `<div class="ui active very light dimmer">${
              this.#header
            }</div></div>`,
        },
        {
          title: "headerlist",
          description: "вертикальный список заголовков",
          content: this.#itemsTemplate
            .replace(
              "#{data}",
              [
                'data-id="list"',
                this.#commonData,
                this.#singleData,
                this.#multiData,
              ].join(" ")
            )
            .replace(
              "#{content}",
              this.#dimmedImage
                .replace("#{loading}", "lazy")
                .replace("#{size}", "small") + this.#header
            ),
        },
        {
          title: "header",
          description: "одиночный заголовок",
          content: `<div class="ui basic fitted segment mceNonEditable" ${[
            'data-id="header"',
            this.#commonData,
            this.#singleData,
          ].join(" ")}>${this.#header}</div>`,
        },
        {
          title: "card",
          description: "одиночная карточка",
          content: `<div class="ui raised link card mceNonEditable" ${[
            'data-id="card"',
            this.#commonData,
            this.#singleData,
          ].join(" ")}>${this.#dimmedImage
            .replace("#{loading}", "eager")
            .replace("#{size}", "")}${this.#header}</div>`,
        },
        {
          title: "doubleheader",
          description: "двойной заголовок",
          content: `<div class="ui placeholder segment mceNonEditable">${this.#grid
            .replace("#{divider}", '<div class="ui vertical divider">☆</div>')
            .replace("#{editable}", "")
            .replace("#{centered}", "")
            .replace("#{count}", "two")
            .replace("#{aos}", "fade-up")
            .replace("#{align}", "center aligned")
            .replace("#{adaptive}", "stackable doubling")
            .replace(
              "#{data}",
              [
                'data-id="doubleheader"',
                this.#commonData,
                this.#singleData,
                this.#multiData,
              ].join(" ")
            )
            .replace("#{content}", this.#header)}</div>`,
        },
        {
          title: "icongrid",
          description: "плитка из иконок",
          content: this.#grid
            .replace("#{divider}", "")
            .replace("#{editable}", "mceNonEditable")
            .replace("#{centered}", "centered")
            .replace("#{count}", "six")
            .replace("#{aos}", "fade-up")
            .replace("#{align}", "center aligned")
            .replace("#{adaptive}", "stackable doubling")
            .replace(
              "#{data}",
              [
                'data-id="icongrid"',
                this.#commonData,
                this.#singleData,
                this.#multiData,
              ].join(" ")
            )
            .replace("#{content}", this.#header),
        },
        {
          title: "cardgrid",
          description: "плитка из карточек",
          content: this.#grid
            .replace("#{divider}", "")
            .replace("#{editable}", "mceNonEditable")
            .replace("#{centered}", "centered")
            .replace("#{count}", "three")
            .replace("#{aos}", "flip-left")
            .replace("#{align}", "")
            .replace("#{adaptive}", "stackable doubling")
            .replace(
              "#{data}",
              [
                'data-id="cardgrid"',
                this.#commonData,
                this.#singleData,
                this.#multiData,
              ].join(" ")
            )
            .replace(
              "#{content}",
              `<div class="ui fluid raised link card">${this.#dimmedImage
                .replace("#{loading}", "eager")
                .replace("#{size}", "")}${this.#header}</div>`
            ),
        },
        {
          title: "youtube",
          description: "вставка youtube ролика",
          content:
            "<div" +
            " " +
            'class="ui embed mceNonEditable"' +
            " " +
            'data-source="youtube"' +
            " " +
            'data-id="TaOoK8kd6Zg"' +
            " " +
            'data-placeholder="' +
            "//i.ytimg.com/vi/TaOoK8kd6Zg/maxresdefault.jpg" +
            '"' +
            "></div>",
        },
        {
          title: "breadcrumbs",
          description: "путь до текущей страницы",
          content:
            `<div class="ui mini fluid steps mceNonEditable" ${[
              'data-id="breadcrumbs"',
              'data-reveal="true"',
              this.#commonData,
              this.#singleData,
              this.#multiData,
            ].join(" ")}><a class="step">` +
            `<i class="hvr-wobble-vertical icon"><!-- --></i>` +
            `<span class="content">` +
            `<span class="ui title tiny header">` +
            `<span class="ui">` +
            `<span class="sub header"><!-- --></span>` +
            `</span></span></span>` +
            `</a></div>`,
        },
        {
          title: "pagination",
          description: "пейджер с номерами страниц и стрелками",
          content: `<div class="ui pagination menu mceNonEditable" ${[
            'data-id="pagination"',
            this.#commonData,
            this.#multiData,
          ].join(" ")}><a class="item"><!-- --></a></div>`,
        },
        {
          title: "parentbutton",
          description: "кнопка к родительской странице",
          content: `<a class="ui labeled icon button mceNonEditable" ${[
            'data-id="parentbutton"',
            this.#commonData,
            'data-reveal="true"',
          ].join(" ")}><i class="left arrow icon"></i>Back</a>`,
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
