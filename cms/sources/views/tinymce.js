import { JetView } from "webix-jet";
import * as webix from "webix";
import "../tinymce5";
import tinymce from "tinymce";

/* Import content css */
import contentUiCss from "tinymce/skins/ui/oxide/content.css";
import contentCss from "tinymce/skins/content/default/content.css";

/* Import fonts */
import "@fontsource/alegreya";
import "@fontsource/alegreya-sans";
import "@fontsource/alegreya-sans-sc";
import "@fontsource/alegreya-sc";
import "@fontsource/alice";
import "@fontsource/amatic-sc";
import "@fontsource/andika";
import "@fontsource/anonymous-pro";
import "@fontsource/arimo";
import "@fontsource/arsenal";
import "@fontsource/bad-script";
import "@fontsource/caveat";
import "@fontsource/comfortaa";
import "@fontsource/cormorant-garamond";
import "@fontsource/cormorant-infant";
import "@fontsource/cormorant-sc";
import "@fontsource/cormorant-unicase";
import "@fontsource/cormorant";
import "@fontsource/cousine";
import "@fontsource/cuprum";
import "@fontsource/didact-gothic";
import "@fontsource/eb-garamond";
import "@fontsource/el-messiri";
import "@fontsource/exo-2";
import "@fontsource/fira-code";
import "@fontsource/fira-mono";
import "@fontsource/fira-sans-condensed";
import "@fontsource/fira-sans-extra-condensed";
import "@fontsource/fira-sans";
import "@fontsource/forum";
import "@fontsource/gabriela";
import "@fontsource/ibm-plex-mono";
import "@fontsource/ibm-plex-sans";
import "@fontsource/ibm-plex-serif";
import "@fontsource/istok-web";
import "@fontsource/jura";
import "@fontsource/kelly-slab";
import "@fontsource/kosugi";
import "@fontsource/kosugi-maru";
import "@fontsource/kurale";
import "@fontsource/ledger";
import "@fontsource/literata";
import "@fontsource/lobster";
import "@fontsource/lora";
import "@fontsource/m-plus-1p";
import "@fontsource/m-plus-rounded-1c";
import "@fontsource/marck-script";
import "@fontsource/marmelad";
import "@fontsource/merriweather";
import "@fontsource/montserrat";
import "@fontsource/montserrat-alternates";
import "@fontsource/neucha";
import "@fontsource/noto-sans";
import "@fontsource/noto-sans-sc";
import "@fontsource/noto-serif";
import "@fontsource/noto-serif-sc";
import "@fontsource/noto-serif-tc";
import "@fontsource/old-standard-tt";
import "@fontsource/open-sans-condensed";
import "@fontsource/open-sans";
import "@fontsource/oranienbaum";
import "@fontsource/oswald";
import "@fontsource/pacifico";
import "@fontsource/pangolin";
import "@fontsource/pattaya";
import "@fontsource/philosopher";
import "@fontsource/play";
import "@fontsource/playfair-display-sc";
import "@fontsource/playfair-display";
import "@fontsource/podkova";
import "@fontsource/poiret-one";
import "@fontsource/prata";
import "@fontsource/press-start-2p";
import "@fontsource/prosto-one";
import "@fontsource/pt-mono";
import "@fontsource/pt-sans-caption";
import "@fontsource/pt-sans-narrow";
import "@fontsource/pt-sans";
import "@fontsource/pt-serif-caption";
import "@fontsource/pt-serif";
import "@fontsource/roboto-condensed";
import "@fontsource/roboto-mono";
import "@fontsource/roboto-slab";
import "@fontsource/roboto";
import "@fontsource/rubik-mono-one";
import "@fontsource/rubik";
import "@fontsource/ruslan-display";
import "@fontsource/russo-one";
import "@fontsource/sawarabi-gothic";
import "@fontsource/scada";
import "@fontsource/seymour-one";
import "@fontsource/source-code-pro";
import "@fontsource/source-sans-pro";
import "@fontsource/spectral";
import "@fontsource/spectral-sc";
import "@fontsource/stalinist-one";
import "@fontsource/tenor-sans";
import "@fontsource/tinos";
import "@fontsource/ubuntu-condensed";
import "@fontsource/ubuntu-mono";
import "@fontsource/ubuntu";
import "@fontsource/underdog";
import "@fontsource/vollkorn";
import "@fontsource/vollkorn-sc";
import "@fontsource/yanone-kaffeesatz";
import "@fontsource/yeseva-one";

/**
 *
 */
export default class TinymceView extends JetView {
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
   * @param app
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
   *
   */
  config = async () => ({
    id: "tinymce",
    view: "tinymce5-editor",
    apiKey: "r2lw5k8fd0gyrwrhztc4ie6zdmanh9ovn6c38xwh8ujjimpw",
    config: {
      mobile: {
        theme: "silver",
        menubar: false,
      },
      plugins:
        "print " +
        "preview " +
        "paste " +
        "importcss " +
        "searchreplace " +
        "autolink " +
        "autosave " +
        "save " +
        "directionality " +
        "code " +
        "visualblocks " +
        "visualchars " +
        "fullscreen " +
        "image " +
        "link " +
        "media " +
        "template " +
        "codesample " +
        "table " +
        "charmap " +
        "hr " +
        "pagebreak " +
        "nonbreaking " +
        "anchor " +
        "insertdatetime " +
        "advlist " +
        "lists " +
        "wordcount " +
        "textpattern " +
        "noneditable " +
        "charmap " +
        "quickbars " +
        "emoticons ",
      menubar: "file edit view insert format tools table",
      toolbar:
        "undo redo" +
        " | " +
        "rlink" +
        " | " +
        "bold italic underline strikethrough" +
        " | " +
        "fontselect fontsizeselect formatselect" +
        " | " +
        "alignleft aligncenter alignright alignjustify" +
        " | " +
        "outdent indent" +
        " |  " +
        "numlist bullist" +
        " | " +
        "forecolor backcolor removeformat" +
        " | " +
        "pagebreak" +
        " | " +
        "charmap emoticons" +
        " | " +
        "fullscreen preview print" +
        " | " +
        "insertfile image media template link unlink anchor codesample" +
        " | " +
        "ltr rtl",
      toolbar_sticky: true,
      content_css_cors: true,
      content_css: `index.cdn.css,${Object.values(
        await (
          await fetch("assets-manifest.json", { cache: "no-store" })
        ).json()
      )
        .filter((element) => /.\.css$/.test(element))
        .map((element) => `${window.location.origin}/${element}`)
        .join(",")},index.css`,
      skin: false,
      content_style: `${contentUiCss.toString()}\n${contentCss.toString()}`,
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
      font_formats:
        "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats" +
        ";" +
        'Alegreya="Alegreya";' +
        'Alegreya Sans="Alegreya Sans";' +
        'Alegreya Sans SC="Alegreya Sans SC";' +
        'Alegreya SC="Alegreya SC";' +
        'Alice="Alice";' +
        'Amatic SC="Amatic SC";' +
        'Andika="Andika";' +
        'Anonymous Pro="Anonymous Pro";' +
        'Arimo="Arimo";' +
        'Arsenal="Arsenal";' +
        'Bad Script="Bad Script";' +
        'Caveat="Caveat";' +
        'Comfortaa="Comfortaa";' +
        'Cormorant Garamond="Cormorant Garamond";' +
        'Cormorant Infant="Cormorant Infant";' +
        'Cormorant SC="Cormorant SC";' +
        'Cormorant Unicase="Cormorant Unicase";' +
        'Cormorant="Cormorant";' +
        'Cousine="Cousine";' +
        'Cuprum="Cuprum";' +
        'Didact Gothic="Didact Gothic";' +
        'EB Garamond="EB Garamond";' +
        'El Messiri="El Messiri";' +
        'Exo 2="Exo 2";' +
        'Fira Code="Fira Code";' +
        'Fira Mono="Fira Mono";' +
        'Fira Sans Condensed="Fira Sans Condensed";' +
        'Fira Sans Extra Condensed="Fira Sans Extra Condensed";' +
        'Fira Sans="Fira Sans";' +
        'Forum="Forum";' +
        'Gabriela="Gabriela";' +
        'IBM Plex Mono="IBM Plex Mono";' +
        'IBM Plex Sans="IBM Plex Sans";' +
        'IBM Plex Serif="IBM Plex Serif";' +
        'Istok Web="Istok Web";' +
        'Jura="Jura";' +
        'Kelly Slab="Kelly Slab";' +
        'Kosugi="Kosugi";' +
        'Kosugi Maru="Kosugi Maru";' +
        'Kurale="Kurale";' +
        'Ledger="Ledger";' +
        'Literata="Literata";' +
        'Lobster="Lobster";' +
        'Lora="Lora";' +
        'M PLUS 1p="M PLUS 1p";' +
        'M PLUS Rounded 1c="M PLUS Rounded 1c";' +
        'Marck Script="Marck Script";' +
        'Marmelad="Marmelad";' +
        'Merriweather="Merriweather";' +
        'Montserrat="Montserrat";' +
        'Montserrat Alternates="Montserrat Alternates";' +
        'Neucha="Neucha";' +
        'Noto Sans="Noto Sans";' +
        'Noto Sans SC="Noto Sans SC";' +
        'Noto Serif="Noto Serif";' +
        'Noto Serif SC="Noto Serif SC";' +
        'Noto Serif TC="Noto Serif TC";' +
        'Old Standard TT="Old Standard TT";' +
        'Open Sans Condensed="Open Sans Condensed";' +
        'Open Sans="Open Sans";' +
        'Oranienbaum="Oranienbaum";' +
        'Oswald="Oswald";' +
        'Pacifico="Pacifico";' +
        'Pangolin="Pangolin";' +
        'Pattaya="Pattaya";' +
        'Philosopher="Philosopher";' +
        'Play="Play";' +
        'Playfair Display SC="Playfair Display SC";' +
        'Playfair Display="Playfair Display";' +
        'Podkova="Podkova";' +
        'Poiret One="Poiret One";' +
        'Prata="Prata";' +
        'Press Start 2P="Press Start 2P";' +
        'Prosto One="Prosto One";' +
        'PT Mono="PT Mono";' +
        'PT Sans Caption="PT Sans Caption";' +
        'PT Sans Narrow="PT Sans Narrow";' +
        'PT Sans="PT Sans";' +
        'PT Serif Caption="PT Serif Caption";' +
        'PT Serif="PT Serif";' +
        'Roboto Condensed="Roboto Condensed";' +
        'Roboto Mono="Roboto Mono";' +
        'Roboto Slab="Roboto Slab";' +
        'Roboto="Roboto";' +
        'Rubik Mono One="Rubik Mono One";' +
        'Rubik="Rubik";' +
        'Ruslan Display="Ruslan Display";' +
        'Russo One="Russo One";' +
        'Sawarabi Gothic="Sawarabi Gothic";' +
        'Scada="Scada";' +
        'Seymour One="Seymour One";' +
        'Source Code Pro="Source Code Pro";' +
        'Source Sans Pro="Source Sans Pro";' +
        'Spectral="Spectral";' +
        'Spectral SC="Spectral SC";' +
        'Stalinist One="Stalinist One";' +
        'Tenor Sans="Tenor Sans";' +
        'Tinos="Tinos";' +
        'Ubuntu Condensed="Ubuntu Condensed";' +
        'Ubuntu Mono="Ubuntu Mono";' +
        'Ubuntu="Ubuntu";' +
        'Underdog="Underdog";' +
        'Vollkorn="Vollkorn";' +
        'Vollkorn SC="Vollkorn SC";' +
        'Yanone Kaffeesatz="Yanone Kaffeesatz";' +
        'Yeseva One="Yeseva One";',
      style_formats: [
        {
          title: "Animation",
          items: [
            {
              title: "Fade",
              items: [
                {
                  title: "fade",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade",
                  },
                },
                {
                  title: "fade-up",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-up",
                  },
                },
                {
                  title: "fade-down",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-down",
                  },
                },
                {
                  title: "fade-left",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-left",
                  },
                },
                {
                  title: "fade-right",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-right",
                  },
                },
                {
                  title: "fade-up-right",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-up-right",
                  },
                },
                {
                  title: "fade-up-left",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-up-left",
                  },
                },
                {
                  title: "fade-down-right",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-down-right",
                  },
                },
                {
                  title: "fade-down-left",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "fade-down-left",
                  },
                },
              ],
            },
            {
              title: "Flip",
              items: [
                {
                  title: "flip-up",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "flip-up",
                  },
                },
                {
                  title: "flip-down",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "flip-down",
                  },
                },
                {
                  title: "flip-left",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "flip-left",
                  },
                },
                {
                  title: "flip-right",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "flip-right",
                  },
                },
              ],
            },
            {
              title: "Slide",
              items: [
                {
                  title: "slide-up",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "slide-up",
                  },
                },
                {
                  title: "slide-down",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "slide-down",
                  },
                },
                {
                  title: "slide-left",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "slide-left",
                  },
                },
                {
                  title: "slide-right",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "slide-right",
                  },
                },
              ],
            },
            {
              title: "Zoom",
              items: [
                {
                  title: "zoom-in",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-in",
                  },
                },
                {
                  title: "zoom-in-up",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-in-up",
                  },
                },
                {
                  title: "zoom-in-down",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-in-down",
                  },
                },
                {
                  title: "zoom-in-left",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-in-left",
                  },
                },
                {
                  title: "zoom-in-right",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-in-right",
                  },
                },
                {
                  title: "zoom-out",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-out",
                  },
                },
                {
                  title: "zoom-out-up",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-out-up",
                  },
                },
                {
                  title: "zoom-out-down",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-out-down",
                  },
                },
                {
                  title: "zoom-out-left",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-out-left",
                  },
                },
                {
                  title: "zoom-out-right",
                  selector: "*",
                  classes: "aos-init aos-animate",
                  attributes: {
                    "data-aos": "zoom-out-right",
                  },
                },
              ],
            },
          ],
        },
        {
          title: "Hover",
          items: [
            {
              title: "2D Transitions",
              items: [
                {
                  title: "Grow",
                  selector: "*",
                  classes: "hvr-grow",
                },
                {
                  title: "Shrink",
                  selector: "*",
                  classes: "hvr-shrink",
                },
                {
                  title: "Pulse",
                  selector: "*",
                  classes: "hvr-pulse",
                },
                {
                  title: "Pulse Grow",
                  selector: "*",
                  classes: "hvr-pulse-grow",
                },
                {
                  title: "Pulse Shrink",
                  selector: "*",
                  classes: "hvr-pulse-shrink",
                },
                {
                  title: "Push",
                  selector: "*",
                  classes: "hvr-push",
                },
                {
                  title: "Pop",
                  selector: "*",
                  classes: "hvr-pop",
                },
                {
                  title: "Bounce In",
                  selector: "*",
                  classes: "hvr-bounce-in",
                },
                {
                  title: "Bounce Out",
                  selector: "*",
                  classes: "hvr-bounce-out",
                },
                {
                  title: "Rotate",
                  selector: "*",
                  classes: "hvr-rotate",
                },
                {
                  title: "Grow Rotate",
                  selector: "*",
                  classes: "hvr-grow-rotate",
                },
                {
                  title: "Float",
                  selector: "*",
                  classes: "hvr-float",
                },
                {
                  title: "Sink",
                  selector: "*",
                  classes: "hvr-sink",
                },
                {
                  title: "Bob",
                  selector: "*",
                  classes: "hvr-bob",
                },
                {
                  title: "Hang",
                  selector: "*",
                  classes: "hvr-hang",
                },
                {
                  title: "Skew",
                  selector: "*",
                  classes: "hvr-skew",
                },
                {
                  title: "Skew Forward",
                  selector: "*",
                  classes: "hvr-skew-forward",
                },
                {
                  title: "Skew Backward",
                  selector: "*",
                  classes: "hvr-skew-backward",
                },
                {
                  title: "Wobble Vertical",
                  selector: "*",
                  classes: "hvr-wobble-vertical",
                },
                {
                  title: "Wobble Horizontal",
                  selector: "*",
                  classes: "hvr-wobble-horizontal",
                },
                {
                  title: "Wobble To Bottom Right",
                  selector: "*",
                  classes: "hvr-wobble-to-bottom-right",
                },
                {
                  title: "Wobble To Top Right",
                  selector: "*",
                  classes: "hvr-wobble-to-top-right",
                },
                {
                  title: "Wobble Top",
                  selector: "*",
                  classes: "hvr-wobble-top",
                },
                {
                  title: "Wobble Bottom",
                  selector: "*",
                  classes: "hvr-wobble-bottom",
                },
                {
                  title: "Wobble Skew",
                  selector: "*",
                  classes: "hvr-wobble-skew",
                },
                {
                  title: "Buzz",
                  selector: "*",
                  classes: "hvr-buzz",
                },
                {
                  title: "Buzz Out",
                  selector: "*",
                  classes: "hvr-buzz-out",
                },
                {
                  title: "Forward",
                  selector: "*",
                  classes: "hvr-forward",
                },
                {
                  title: "Backward",
                  selector: "*",
                  classes: "hvr-backward",
                },
              ],
            },
            {
              title: "Background Transitions",
              items: [
                {
                  title: "Fade",
                  selector: "*",
                  classes: "hvr-fade",
                },
                {
                  title: "Back Pulse",
                  selector: "*",
                  classes: "hvr-back-pulse",
                },
                {
                  title: "Sweep To Right",
                  selector: "*",
                  classes: "hvr-sweep-to-right",
                },
                {
                  title: "Sweep To Left",
                  selector: "*",
                  classes: "hvr-sweep-to-left",
                },
                {
                  title: "Sweep To Bottom",
                  selector: "*",
                  classes: "hvr-sweep-to-bottom",
                },
                {
                  title: "Sweep To Top",
                  selector: "*",
                  classes: "hvr-sweep-to-top",
                },
                {
                  title: "Bounce To Right",
                  selector: "*",
                  classes: "hvr-bounce-to-right",
                },
                {
                  title: "Bounce To Left",
                  selector: "*",
                  classes: "hvr-bounce-to-left",
                },
                {
                  title: "Bounce To Bottom",
                  selector: "*",
                  classes: "hvr-bounce-to-bottom",
                },
                {
                  title: "Bounce To Top",
                  selector: "*",
                  classes: "hvr-bounce-to-top",
                },
                {
                  title: "Radial Out",
                  selector: "*",
                  classes: "hvr-radial-out",
                },
                {
                  title: "Radial In",
                  selector: "*",
                  classes: "hvr-radial-in",
                },
                {
                  title: "Rectangle In",
                  selector: "*",
                  classes: "hvr-rectangle-in",
                },
                {
                  title: "Rectangle Out",
                  selector: "*",
                  classes: "hvr-rectangle-out",
                },
                {
                  title: "Shutter In Horizontal",
                  selector: "*",
                  classes: "hvr-shutter-in-horizontal",
                },
                {
                  title: "Shutter Out Horizontal",
                  selector: "*",
                  classes: "hvr-shutter-out-horizontal",
                },
                {
                  title: "Shutter In Vertical",
                  selector: "*",
                  classes: "hvr-shutter-in-vertical",
                },
                {
                  title: "Shutter Out Vertical",
                  selector: "*",
                  classes: "hvr-shutter-out-vertical",
                },
              ],
            },
            {
              title: "Border Transitions",
              items: [
                {
                  title: "Border Fade",
                  selector: "*",
                  classes: "hvr-border-fade",
                },
                {
                  title: "Hollow",
                  selector: "*",
                  classes: "hvr-hollow",
                },
                {
                  title: "Trim",
                  selector: "*",
                  classes: "hvr-trim",
                },
                {
                  title: "Ripple Out",
                  selector: "*",
                  classes: "hvr-ripple-out",
                },
                {
                  title: "Ripple In",
                  selector: "*",
                  classes: "hvr-ripple-in",
                },
                {
                  title: "Outline Out",
                  selector: "*",
                  classes: "hvr-outline-out",
                },
                {
                  title: "Outline In",
                  selector: "*",
                  classes: "hvr-outline-in",
                },
                {
                  title: "Round Corners",
                  selector: "*",
                  classes: "hvr-round-corners",
                },
                {
                  title: "Underline From Left",
                  selector: "*",
                  classes: "hvr-underline-from-left",
                },
                {
                  title: "Underline From Center",
                  selector: "*",
                  classes: "hvr-underline-from-center",
                },
                {
                  title: "Underline From Right",
                  selector: "*",
                  classes: "hvr-underline-from-right",
                },
                {
                  title: "Overline From Left",
                  selector: "*",
                  classes: "hvr-overline-from-left",
                },
                {
                  title: "Overline From Center",
                  selector: "*",
                  classes: "hvr-overline-from-center",
                },
                {
                  title: "Overline From Right",
                  selector: "*",
                  classes: "hvr-overline-from-right",
                },
                {
                  title: "Reveal",
                  selector: "*",
                  classes: "hvr-reveal",
                },
                {
                  title: "Underline Reveal",
                  selector: "*",
                  classes: "hvr-underline-reveal",
                },
                {
                  title: "Overline Reveal",
                  selector: "*",
                  classes: "hvr-overline-reveal",
                },
              ],
            },
            {
              title: "Shadow/Glow Transitions",
              items: [
                {
                  title: "Glow",
                  selector: "*",
                  classes: "hvr-glow",
                },
                {
                  title: "Shadow",
                  selector: "*",
                  classes: "hvr-shadow",
                },
                {
                  title: "Grow Shadow",
                  selector: "*",
                  classes: "hvr-grow-shadow",
                },
                {
                  title: "Box Shadow Outset",
                  selector: "*",
                  classes: "hvr-box-shadow-outset",
                },
                {
                  title: "Box Shadow Inset",
                  selector: "*",
                  classes: "hvr-box-shadow-inset",
                },
                {
                  title: "Float Shadow",
                  selector: "*",
                  classes: "hvr-float-shadow",
                },
                {
                  title: "Shadow Radial",
                  selector: "*",
                  classes: "hvr-shadow-radial",
                },
              ],
            },
            {
              title: "Speech Bubbles",
              items: [
                {
                  title: "Bubble Top",
                  selector: "*",
                  classes: "hvr-bubble-top",
                },
                {
                  title: "Bubble Right",
                  selector: "*",
                  classes: "hvr-bubble-right",
                },
                {
                  title: "Bubble Bottom",
                  selector: "*",
                  classes: "hvr-bubble-bottom",
                },
                {
                  title: "Bubble Left",
                  selector: "*",
                  classes: "hvr-bubble-left",
                },
                {
                  title: "Bubble Float Top",
                  selector: "*",
                  classes: "hvr-bubble-float-top",
                },
                {
                  title: "Bubble Float Right",
                  selector: "*",
                  classes: "hvr-bubble-float-right",
                },
                {
                  title: "Bubble Float Bottom",
                  selector: "*",
                  classes: "hvr-bubble-float-bottom",
                },
                {
                  title: "Bubble Float Left",
                  selector: "*",
                  classes: "hvr-bubble-float-left",
                },
              ],
            },
            {
              title: "Icons",
              items: [
                {
                  title: "Icon Back",
                  selector: "*",
                  classes: "hvr-icon-back",
                },
                {
                  title: "Icon Forward",
                  selector: "*",
                  classes: "hvr-icon-forward",
                },
                {
                  title: "Icon Down",
                  selector: "*",
                  classes: "hvr-icon-down",
                },
                {
                  title: "Icon Up",
                  selector: "*",
                  classes: "hvr-icon-up",
                },
                {
                  title: "Icon Spin",
                  selector: "*",
                  classes: "hvr-icon-spin",
                },
                {
                  title: "Icon Drop",
                  selector: "*",
                  classes: "hvr-icon-drop",
                },
                {
                  title: "Icon Fade",
                  selector: "*",
                  classes: "hvr-icon-fade",
                },
                {
                  title: "Icon Float Away",
                  selector: "*",
                  classes: "hvr-icon-float-away",
                },
                {
                  title: "Icon Sink Away",
                  selector: "*",
                  classes: "hvr-icon-sink-away",
                },
                {
                  title: "Icon Grow",
                  selector: "*",
                  classes: "hvr-icon-grow",
                },
                {
                  title: "Icon Shrink",
                  selector: "*",
                  classes: "hvr-icon-shrink",
                },
                {
                  title: "Icon Pulse",
                  selector: "*",
                  classes: "hvr-icon-pulse",
                },
                {
                  title: "Icon Pulse Grow",
                  selector: "*",
                  classes: "hvr-icon-pulse-grow",
                },
                {
                  title: "Icon Pulse Shrink",
                  selector: "*",
                  classes: "hvr-icon-pulse-shrink",
                },
                {
                  title: "Icon Push",
                  selector: "*",
                  classes: "hvr-icon-push",
                },
                {
                  title: "Icon Pop",
                  selector: "*",
                  classes: "hvr-icon-pop",
                },
                {
                  title: "Icon Bounce",
                  selector: "*",
                  classes: "hvr-icon-bounce",
                },
                {
                  title: "Icon Rotate",
                  selector: "*",
                  classes: "hvr-icon-rotate",
                },
                {
                  title: "Icon Grow Rotate",
                  selector: "*",
                  classes: "hvr-icon-grow-rotate",
                },
                {
                  title: "Icon Float",
                  selector: "*",
                  classes: "hvr-icon-float",
                },
                {
                  title: "Icon Sink",
                  selector: "*",
                  classes: "hvr-icon-sink",
                },
                {
                  title: "Icon Bob",
                  selector: "*",
                  classes: "hvr-icon-bob",
                },
                {
                  title: "Icon Hang",
                  selector: "*",
                  classes: "hvr-icon-hang",
                },
                {
                  title: "Icon Wobble Horizontal",
                  selector: "*",
                  classes: "hvr-icon-wobble-horizontal",
                },
                {
                  title: "Icon Wobble Vertical",
                  selector: "*",
                  classes: "hvr-icon-wobble-vertical",
                },
                {
                  title: "Icon Buzz",
                  selector: "*",
                  classes: "hvr-icon-buzz",
                },
                {
                  title: "Icon Buzz Out",
                  selector: "*",
                  classes: "hvr-icon-buzz-out",
                },
              ],
            },
            {
              title: "Curls",
              items: [
                {
                  title: "Curl Top Left",
                  selector: "*",
                  classes: "hvr-curl-top-left",
                },
                {
                  title: "Curl Top Right",
                  selector: "*",
                  classes: "hvr-curl-top-right",
                },
                {
                  title: "Curl Bottom Right",
                  selector: "*",
                  classes: "hvr-curl-bottom-right",
                },
                {
                  title: "Curl Bottom Left",
                  selector: "*",
                  classes: "hvr-curl-bottom-left",
                },
              ],
            },
          ],
        },
      ],
      /**
       * @param editor
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
             * @param callback
             */
            fetch: (callback) => {
              const item = $$("tree").getFirstId();
              if (item) callback(this.getSubmenuItems(item, ""));
            },
          });
        }
      },
      file_picker_types: "image media file",
      /**
       * @param cb
       */
      file_picker_callback: (cb) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*,video/*");
        /**
         *
         */
        input.onchange = () => {
          const file = input.files[0];
          const reader = new FileReader();
          /**
           *
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
              cb(filePath, { alt: decodeURI(file.name) });
            } catch (err) {
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
      visualblocks_default_state: true,
      allow_conditional_comments: true,
      allow_html_in_named_anchor: true,
      element_format: "html",
      quickbars_insert_toolbar: false,
      quickbars_selection_toolbar:
        "bold italic" +
        " | " +
        "quicklink h2 h3 blockquote quickimage quicktable",
      toolbar_mode: "sliding",
      contextmenu: "link image table",
      extended_valid_elements: "script[*],i[*],span[*],img[*]",
      valid_children:
        "+body[style]," +
        "+body[link]," +
        "+h1[div]," +
        "+h2[div]," +
        "+h3[div]," +
        "+h4[div]," +
        "+h5[div]," +
        "+h6[div]",
      branding: false,
      browser_spellcheck: true,
      convert_urls: false,
      image_advtab: true,
      image_caption: true,
      image_title: true,
      allow_script_urls: true,
      style_formats_autohide: true,
      style_formats_merge: true,
      paste_data_images: true,
      importcss_append: true,
      images_reuse_filename: true,
      /**
       * @param blobInfo
       * @param success
       * @param failure
       */
      images_upload_handler: async (blobInfo, success, failure) => {
        const filePath = `${webix.uid()}.${decodeURI(blobInfo.filename())
          .split(".")
          .pop()}`;
        try {
          await this.app.io.putObject(
            filePath,
            blobInfo.blob().type,
            blobInfo.blob()
          );
          success(filePath);
        } catch (err) {
          failure(err.message);
        }
      },
      relative_urls: false,
      remove_script_host: false,
      document_base_url: `https://s3.${this.app.io.getRegion()}.amazonaws.com/${this.app.io.getBucket()}/`,
      statusbar: false,
      resize: false,
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
   *
   */
  async ready() {
    (await $$("tinymce").getEditor(true)).on("Change", () =>
      this.getParentView().save.call(this.getParentView())
    );
  }

  /**
   * @param pId
   * @param pPath
   */
  getSubmenuItems(pId, pPath) {
    /**
     * @param {object} that указатель на объект
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
        tinymce.execCommand("mceInsertLink", !1, `${that.path}/${that.text}/`);
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
         *
         */
        onAction: () => onAction(lItem),
      };
      if ($$("tree").getFirstChildId(lId)) {
        lItem.icon = "chevron-right";
        /**
         *
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
   * Инициализация tinyMCE
   *
   * @param {string} val Контент
   */
  async setValue(val) {
    const pTinymce = await $$("tinymce").getEditor(true);
    pTinymce.off("SetContent");
    pTinymce.off("Change");
    pTinymce.getWin().scrollTo(0, 0);
    pTinymce.setContent(val);
    pTinymce.undoManager.clear();
    pTinymce.nodeChanged();
    pTinymce.on("Change", () =>
      this.getParentView().save.call(this.getParentView())
    );
    pTinymce.on("SetContent", () =>
      this.getParentView().save.call(this.getParentView())
    );
  }
}
