<template lang="pug">
div
  q-editor.col.column.full-width(
    ref="editorRef",
    v-model="selectedValue",
    :dense="$q.screen.lt.md",
    :toolbar="editorTlb",
    :fonts="editorFnt",
    content-class="col prose max-w-none full-width text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    flat,
    placeholder="Добавьте контент на вашу страницу...",
    :definitions="editorDef",
    @paste="capture",
    @drop="capture"
  )
  q-dialog(
    v-model="template",
    full-width,
    full-height,
    persistent,
    @show="showDialog"
  )
    q-card.column.w-full
      q-card-section.row.q-pb-none.items-center
        .text-h6 Выбор компонента для вставки
        q-space
        q-btn(v-close-popup, icon="close", flat, round, dense)
      q-card-section
        q-select(
          v-model="model",
          filled,
          :options="options",
          label="Компонент",
          emit-value,
          map-options
        )
      q-card-section.col.column.w-full
        q-card.col.column.w-full(flat, bordered)
          q-card-section.col.column.w-full
            // eslint-disable vue/no-v-html
            .col.prose.column.q-pa-xl.w-full.max-w-none.overflow-auto(
              ref="modalRef",
              class="[&>*]:m-auto [&>*]:!min-h-fit [&>*]:min-w-fit",
              v-html="model"
            )
            // eslint-enable vue/no-v-html
      q-card-actions.text-primary(align="right")
        q-btn(v-close-popup, flat, label="Отмена")
        q-btn(
          v-close-popup,
          flat,
          label="Ok",
          @click="editorRef.runCmd('insertHTML', model)"
        )
  q-dialog(v-model="routerLink", full-width, full-height, persistent)
    q-card.column
      q-card-section.row.q-pb-none.items-center
        .text-h6 Выбор внутренней ссылки для вставки
        q-space
        q-btn(v-close-popup, icon="close", flat, round, dense)
      q-card-section.col.column.full-width
        q-card.col.column.full-width(flat, bordered)
          q-card-section.col.column.full-width
            q-tree.col.scroll.full-width(
              v-if="content",
              v-model:selected="inserted",
              :nodes="content",
              default-expand-all,
              node-key="id",
              no-selection-unset,
              selected-color="primary"
            )
      q-card-actions.text-primary(align="right")
        q-btn(v-close-popup, flat, label="Отмена")
        q-btn(
          v-close-popup,
          flat,
          label="Ok",
          @click="editorRef.runCmd('insertHTML', `<router-link to='/${insertedObject.path}'>${insertedObject.label}</router-link>`)"
        )
</template>

<script setup>
import "daisyui/dist/full.css";

import {
  get,
  isDefined,
  set,
  useArrayFind,
  useFileDialog,
  watchOnce,
} from "@vueuse/core";
import * as mime from "mime-types";
import { storeToRefs } from "pinia";
import { uid, useQuasar } from "quasar";
import { onMounted, reactive, ref, watch } from "vue";

import storeApp from "@/stores/app";
import storeS3 from "@/stores/s3";
import { fonts } from "~/uno.config";

const template = ref(false);
const routerLink = ref(false);
const $q = useQuasar();
const store = storeS3();
const { base } = storeToRefs(store);
const { putFile } = store;
const { content, flatTree, selectedObject, selectedValue } =
  storeToRefs(storeApp());
const inserted = ref(null);
const insertedObject = useArrayFind(flatTree, ({ id }) => id === get(inserted));
/**
 * Инициализация
 *
 * @param {Array} content - Дерево контента
 * @param {object} content."0" - Корневой элемент
 */
const init = ([{ id }]) => {
  set(inserted, id);
};
if (isDefined(content)) init(get(content));
else watchOnce(content, init);
const editorRef = ref();
const modalRef = ref();
/**
 * { @link
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types
 * }
 *
 * @param {object} file - Файл
 */
const putImage = async (file) => {
  try {
    const { type } = file;
    if (
      [
        "image/apng",
        "image/avif",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ].includes(type)
    ) {
      const filePath = `images/${uid()}.${mime.extension(type)}`;
      await putFile(filePath, type, file);
      get(editorRef).runCmd("insertImage", `${get(base)}/${filePath}`);
    } else
      throw new Error(
        "Тип графического файла не подходит для использования в сети интернет",
      );
  } catch (err) {
    const { message } = err;
    $q.notify({ message });
  }
};
/** @param {object} evt - Объект события */
const capture = (evt) => {
  const { files = [] } =
    evt?.dataTransfer ||
    evt?.originalEvent?.clipboardData ||
    evt?.clipboardData ||
    window?.clipboardData ||
    {};
  const lFiles = [...files];
  if (lFiles.length) {
    evt.preventDefault();
    evt.stopPropagation();
    lFiles.forEach(putImage);
  }
};
const { files, open } = useFileDialog({ accept: "image/*" });
watch(files, (newFiles) => {
  [...newFiles].forEach(putImage);
});
const e = $q.lang.editor;
const i = $q.iconSet.editor;
const editorDef = reactive({
  upload: {
    tip: "Загрузка картинки",
    icon: "cloud_upload",
    handler: open,
  },
  template: {
    tip: "Выбор шаблона",
    icon: "dashboard",
    /** Открытие модального окна */
    handler() {
      set(template, true);
    },
  },
  routerLink: {
    tip: "Вставка внутренней ссылки",
    icon: "share",
    /** Открытие модального окна */
    handler() {
      set(routerLink, true);
    },
  },
  h1: {
    cmd: "formatBlock",
    param: "H1",
    icon: i.heading1 || i.heading,
    tip: e.heading1,
    htmlTip: `<span class="prose"><h1 class="no-margin">${e.heading1}</h1></span>`,
  },
  h2: {
    cmd: "formatBlock",
    param: "H2",
    icon: i.heading2 || i.heading,
    tip: e.heading2,
    htmlTip: `<span class="prose"><h2 class="no-margin">${e.heading2}</h2></span>`,
  },
  h3: {
    cmd: "formatBlock",
    param: "H3",
    icon: i.heading3 || i.heading,
    tip: e.heading3,
    htmlTip: `<span class="prose"><h3 class="no-margin">${e.heading3}</h3></span>`,
  },
  h4: {
    cmd: "formatBlock",
    param: "H4",
    icon: i.heading4 || i.heading,
    tip: e.heading4,
    htmlTip: `<span class="prose"><h4 class="no-margin">${e.heading4}</h4></span>`,
  },
  p: {
    cmd: "formatBlock",
    param: "DIV",
    icon: i.heading,
    tip: e.paragraph,
  },
  code: {
    cmd: "formatBlock",
    param: "PRE",
    icon: i.code,
    htmlTip: `<span class="prose"><code>${e.code}</code></span>`,
  },
});
const editorTlb = reactive([
  ["left", "center", "right", "justify"],
  ["bold", "italic", "strike", "underline", "subscript", "superscript"],
  ["token", "hr", "link", "custom_btn"],
  ["print", "fullscreen"],
  [
    {
      label: e.formatting,
      icon: i.formatting,
      list: "no-icons",
      options: ["p", "h1", "h2", "h3", "h4", "code"],
    },
    {
      label: e.fontSize,
      icon: i.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: "no-icons",
      options: [
        "size-1",
        "size-2",
        "size-3",
        "size-4",
        "size-5",
        "size-6",
        "size-7",
      ],
    },
    {
      label: e.defaultFont,
      icon: i.font,
      fixedIcon: true,
      list: "no-icons",
      options: [
        "default_font",
        "arial",
        "arial_black",
        "comic_sans",
        "courier_new",
        "impact",
        "lucida_grande",
        "times_new_roman",
        "verdana",

        ...Object.keys(fonts),
      ],
    },
    "removeFormat",
  ],
  ["quote", "unordered", "ordered", "outdent", "indent"],
  ["undo", "redo"],
  ["upload", "template", "routerLink"],
]);
const editorFnt = reactive({
  arial: "Arial",
  arial_black: "Arial Black",
  comic_sans: "Comic Sans MS",
  courier_new: "Courier New",
  impact: "Impact",
  lucida_grande: "Lucida Grande",
  times_new_roman: "Times New Roman",
  verdana: "Verdana",

  ...fonts,
});
onMounted(() => {
  const { theme } = get(selectedObject) ?? {};
  get(editorRef).getContentEl().dataset.theme = theme;
});
watch(
  () => get(selectedObject)?.theme,
  (value) => {
    get(editorRef).getContentEl().dataset.theme = value;
  },
);
/** ShowDialog */
const showDialog = () => {
  const { theme } = get(selectedObject) ?? {};
  get(modalRef).dataset.theme = theme;
};
const options = reactive([
  {
    label: "Hero",
    value: `
<!--*
    * Контейнер транспаранта
    *
    * @param {string} [v-motion-roll-visible-bottom] - {@link https://motion.vueuse.org/features/presets Анимация}
    * @param {string} [class="hero"] - {@link https://daisyui.com/components/hero/ Транспарант}
    * @param {string} [class="shadow-2xl"] - {@link https://tailwindcss.com/docs/box-shadow Тень}
    * @param {string} [class="rounded-box"] - {@link https://daisyui.com/docs/utilities/#-1 Округлые края}
    * @param {string} [class="flex-auto"] - {@link https://tailwindcss.com/docs/flex#auto flex: 1 1 auto;}
    * @param {string} [class="min-h-[80dvh]"] - {@link https://tailwindcss.com/docs/min-height min-height: 80dvh;}
    * @param {string} [class="min-w-[15rem]"] - {@link https://tailwindcss.com/docs/min-width min-width: 15rem;}
    * @param {string} [class="bg-neutral-content"] - {@link https://daisyui.com/docs/colors/ Подложка нейтрального цвета}
    * @param {string} style - {@link https://developer.mozilla.org/ru/docs/Web/CSS/background-image Изображение подложки}
    *-->
<div v-motion-roll-visible-bottom class="hero shadow-2xl rounded-box flex-auto min-h-[80dvh] bg-neutral-content" :style="the.image?{'background-image':\`url(\${the.image})\`}:{}">
    <!--*
        * При необходимости можно включить оверлей
        *
        * @param {string} [class="hero-overlay"] - {@link https://daisyui.com/components/hero/ Оверлей}
        *-->
    <!--div class="hero-overlay"></div-->
    <!--*
        * Контейнер контента
        *
        * @param {string} [class="hero-content"] - {@link https://daisyui.com/components/hero/ Контейнер для контента}
        * @param {string} [class="w-full"] - {@link https://tailwindcss.com/docs/width width: 100%;}
        *-->
    <div class="hero-content w-full">
        <!--*
            * Контейнер вложенной карточки
            *
            * @param {string} to - {@link https://v3.router.vuejs.org/ru/api/#router-link Линк}
            * @param {string} [class="card"] - {@link https://daisyui.com/components/card/ Контейнер карточки}
            * @param {string} [class="glass"] - {@link https://daisyui.com/docs/utilities/#-2 Эффект матового стекла}
            * @param {string} [class="flex-auto"] - {@link https://tailwindcss.com/docs/flex#auto flex: 1 1 auto;}
            * @param {string} [class="transition-all"] - {@link https://tailwindcss.com/docs/transition-property transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;}
            * @param {string} [class="duration-200"] - {@link https://tailwindcss.com/docs/transition-duration transition-duration: 200ms;}
            * @param {string} [class="hover:-translate-y-1"] - {@link https://tailwindcss.com/docs/translate transform: translateY(-0.25rem);}
            * @param {string} [class="!no-underline"] - {@link https://tailwindcss.com/docs/text-decoration text-decoration-line: none;}
            *
            *-->
        <router-link :to="\`\${the.path}\`"  class="card glass flex-auto transition-all duration-200 hover:-translate-y-1 !no-underline">
            <!--*
                * Контейнер контента вложенной карточки
                *
                * @param {string} [class="card-body"] - {@link https://daisyui.com/components/card/ Контейнер контента карточки}
                * @param {string} [class="items-center"] - {@link https://tailwindcss.com/docs/align-items align-items: center;}
                * @param {string} [class="text-center"] - {@link https://tailwindcss.com/docs/text-align text-align: center;}
                *-->
            <div class="card-body items-center text-center">
                <!--*
                    * Аватар для иконки
                    *
                    * @param {string} [class="avatar"] - {@link https://daisyui.com/components/avatar/ Контейнер аватара}
                    * @param {string} [class="placeholder"] - {@link https://daisyui.com/components/avatar/ Для показа текста в аватаре}
                    * @param {string} [class="text-neutral"] - {@link https://daisyui.com/docs/colors/ Нейтральный цвет текста}
                    *-->
                <div class="avatar placeholder text-neutral">
                    <!--*
                        * Подложка иконки
                        *
                        * @param {string} [class="glass"] - {@link https://daisyui.com/docs/utilities/#-2 Эффект матового стекла}
                        * @param {string} {class="rounded-full"] - {@link https://tailwindcss.com/docs/border-radius Полное скругление}
                        * @param {string} [class="w-24"] - {@link https://tailwindcss.com/docs/width width: 6rem; /* 96px */}
                        * @param {string} [class="md:w-28"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 768px)} { {@link https://tailwindcss.com/docs/width width: 7rem; /* 112px */} }
                        * @param {string} [class="lg:w-32"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1024px)} { {@link https://tailwindcss.com/docs/width width: 8rem; /* 128px */} }
                        * @param {string} [class="xl:w-36"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1280px)} { {@link https://tailwindcss.com/docs/width width: 9rem; /* 144px */} }
                        * @param {string} [class="2xl:w-40"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1536px)} { {@link https://tailwindcss.com/docs/width width: 10rem; /* 160px */} }
                        *-->
                    <div class="glass rounded-full w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40">
                        <!--*
                            * Иконка
                            *
                            * @param {number[]} [viewBox="0 0 24 24"] - {@link https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/viewBox Координаты области просмотра SVG для текущего фрагмента SVG}
                            * @param {string} [class="fill-current"] - {@link https://tailwindcss.com/docs/fill fill: currentColor;}
                            * @param {string} [class="w-14"] - {@link https://tailwindcss.com/docs/width width: 3.5rem; /* 56px */}
                            * @param {string} [class="md:w-16"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 768px)} { {@link https://tailwindcss.com/docs/width width: 4rem; /* 64px */} }
                            * @param {string} [class="lg:w-20"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1024px)} { {@link https://tailwindcss.com/docs/width width: 5rem; /* 80px */} }
                            * @param {string} [class="xl:w-24"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1280px)} { {@link https://tailwindcss.com/docs/width width: 6rem; /* 96px */} }
                            * @param {string} [class="2xl:w-28"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1536px)} { {@link https://tailwindcss.com/docs/width width: 7rem; /* 112px */} }
                            *-->
                        <svg viewBox="0 0 24 24" class="fill-current w-14 md:w-16 lg:w-20 xl:w-24 2xl:w-28">
                            <!--*
                                * Векторное представление иконки
                                *
                                * @param {string} d - {@link https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/d Этот атрибут определяет форму}
                                *-->
                            <path :d="mdi[\`\${the.favicon??'mdiWeb'}\`]"></path>
                        </svg>
                    </div>
                </div>
                <!--*
                    * Заголовок названия страницы
                    *
                    * @param {boolean} v-if - {@link https://v3.ru.vuejs.org/ru/api/directives.html#v-if Элемент показывается, если есть имя страницы}
                    * @param {string} [class="text-ellipsis"] - {@link https://tailwindcss.com/docs/text-overflow#ellipsis text-overflow: ellipsis;}
                    * @param {string} [class="overflow-hidden"] - {@link https://tailwindcss.com/docs/overflow#hiding-content-that-overflows overflow: hidden;}
                    * @param {string} [class="mb-0"] - {@link https://tailwindcss.com/docs/margin margin-bottom: 0px;}
                    *-->
                <h1 v-if="the.name" class="text-ellipsis overflow-hidden mb-0">{{ the.name }}</h1>
                <!--*
                    * Описание страницы
                    *
                    * @param {boolean} v-if - {@link https://v3.ru.vuejs.org/ru/api/directives.html#v-if Элемент показывается, если есть описание страницы}
                    * @param {string} [class="text-ellipsis"] - {@link https://tailwindcss.com/docs/text-overflow#ellipsis text-overflow: ellipsis;}
                    * @param {string} [class="overflow-hidden"] - {@link https://tailwindcss.com/docs/overflow#hiding-content-that-overflows overflow: hidden;}
                    * @param {string} [class="mb-0"] - {@link https://tailwindcss.com/docs/margin margin-bottom: 0px;}
                    *-->
                <p v-if="the.description" class="text-ellipsis overflow-hidden mb-0">{{ the.description }}</p>
            </div>
        </router-link>
    </div>
</div>`,
  },
  {
    label: "Hero Slider",
    value: `
<!--*
    *
    *-->
<div class="col min-h-[80dvh] flex flex-col w-full">
    <!--*
      *
      *-->
    <div class="carousel flex-auto shadow-2xl rounded-box">
        <!--*
            *
            *-->
        <div :id="\`\${the.path}/\${page.urn}\`" class="carousel-item relative w-full" v-for="(page,index) in the.siblings" :key="page.id">
            <!--*
              *
              *-->
            <div class="hero bg-neutral-content" :style="page.image?{'background-image':\`url(\${page.image})\`}:{}">
                <!--*
                    *
                    *-->
                <!--div class="hero-overlay"></div-->
                <!--*
                    *
                    *-->
                <div class="hero-content overflow-x-hidden w-full !z-10">
                    <!--*
                        *
                        *-->
                    <div class="glass rounded-badge p-4 text-center w-full">
                        <!--*
                            *
                            *-->
                        <svg viewBox="0 0 24 24" class="fill-current mx-auto my-5 w-14 md:w-16 lg:w-20 xl:w-24 2xl:w-28">
                            <!--*
                                *
                                *-->
                            <path :d="mdi[\`\${page.favicon??'mdiWeb'}\`]"></path>
                        </svg>
                        <!--*
                            *
                            *-->
                        <h1 class="text-ellipsis overflow-hidden">{{ page.name }}</h1>
                        <!--*
                            *
                            *-->
                        <p v-if="page.description" class="text-ellipsis overflow-hidden">{{ page.description }}</p>
                    </div>
                </div>
            </div>
            <!--*
                *
                *-->
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <!--*
                    *
                    *-->
                <a class="btn btn-circle" :href="\`#\${the.path}/\${the.siblings[(index||the.siblings.length)-1].urn}\`" :class="{'btn-disabled':!index}">❮</a>
                <!--*
                    *
                    *-->
                <a class="btn btn-circle" :href="\`#\${the.path}/\${the.siblings[index+1===the.siblings.length?0:index+1].urn}\`" :class="{'btn-disabled':index+1===the.siblings.length}">❯</a>
            </div>
        </div>
    </div>
    <!--*
        *
        *-->
    <div class="flex justify-center w-full py-2 gap-2">
        <!--*
            *
            *-->
        <a :href="\`#\${the.path}/\${page.urn}\`" class="btn btn-xs" v-for="(page,index) in the.siblings" :key="page.id">{{ index+1 }}</a>
    </div>
</div>`,
  },
  {
    label: "Card",
    value: `
<!--*
    * Внешний контейнер для отображения тени
    *
    * @param {string} [v-motion-roll-visible-bottom] - {@link https://motion.vueuse.org/features/presets Анимация}
    * @param {string} [class="not-prose"] - {@link https://tailwindcss.com/docs/typography-plugin#undoing-typography-styles Не использовать типографику}
    * @param {string} [class="shadow-2xl"] - {@link https://tailwindcss.com/docs/box-shadow Тень}
    * @param {string} [class="rounded-box"] - {@link https://daisyui.com/docs/utilities/#-1 Округлые края}
    * @param {string} [class="m-auto"] - {@link https://tailwindcss.com/docs/margin margin: auto;}
    * @param {string} [class="w-60"] - {@link https://tailwindcss.com/docs/width width: 15rem; /* 240px */}
    * @param {string} [class="md:w-64"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 768px)} { {@link https://tailwindcss.com/docs/width width: 16rem; /* 256px */} }
    * @param {string} [class="lg:w-72"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1024px)} { {@link https://tailwindcss.com/docs/width width: 18rem; /* 288px */} }
    * @param {string} [class="xl:w-80"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1280px)} { {@link https://tailwindcss.com/docs/width width: 20rem; /* 320px */} }
    * @param {string} [class="2xl:w-96"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1536px)} { {@link https://tailwindcss.com/docs/width width: 24rem; /* 384px */} }
    *-->
<div v-motion-roll-visible-bottom class="not-prose shadow-2xl rounded-box m-auto w-60 md:w-64 lg:w-72 xl:w-80 2xl:w-96">
    <!--*
        * Контейнер основной карточки
        *
        * @param {string} to - {@link https://v3.router.vuejs.org/ru/api/#router-link Линк}
        * @param {string} [class="card"] - {@link https://daisyui.com/components/card/ Контейнер карточки}
        * @param {string} [class="card-compact"] - {@link https://daisyui.com/components/card/ Компактная карточка}
        * @param {string} [class="glass"] - {@link https://daisyui.com/docs/utilities/#-2 Эффект матового стекла}
        *-->
    <router-link :to="\`\${the.path}\`" class="card card-compact glass">
        <!--*
            * Контейнер вложенной карточки, для отображения иконки на фоне изображения
            *
            * @param {string} [class="card"] - {@link https://daisyui.com/components/card/ Контейнер карточки}
            * @param {string} [class="image-full"] - {@link https://daisyui.com/components/card/ Карточка с картинкой на подложке}
            *-->
        <figure class="card image-full">
            <!--*
                * Подложка
                *
                * @param {boolean} v-if - {@link https://v3.ru.vuejs.org/ru/api/directives.html#v-if Элемент показывается, если картинка добавлена в свойства страницы}
                *-->
            <figure v-if="the.image">
                <!--*
                    * Изображение подложки
                    *
                    * @param {string} src - {@link https://developer.mozilla.org/ru/docs/Web/HTML/Element/img#src URL изображения}
                    * @param {string} alt - {@link https://developer.mozilla.org/ru/docs/Web/HTML/Element/img#alt Этим атрибутом задаётся альтернативное текстовое описание изображения}
                    * @param {string} [decoding="async"] - {@link https://developer.mozilla.org/ru/docs/Web/HTML/Element/img#decoding Декодировать изображение асинхронно, чтобы уменьшить задержку отображения другого контента}
                    * @param {string} [loading="lazy"] - {@link https://developer.mozilla.org/ru/docs/Web/HTML/Element/img#loading Откладывает загрузку изображения до того момента, пока оно не достигнет подсчитанного расстояния области просмотра, определяемого браузером}
                    *-->
                <img :src="the.image" :alt="the.alt" decoding="async" loading="lazy" />
            </figure>
            <!--*
                * Контейнер контента вложенной карточки
                *
                * @param {string} [class="card-body"] - {@link https://daisyui.com/components/card/ Контейнер контента карточки}
                * @param {string} [class="items-center"] - {@link https://tailwindcss.com/docs/align-items align-items: center;}
                *-->
            <div class="card-body items-center">
                <!--*
                    * Аватар для иконки
                    *
                    * @param {string} [class="avatar"] - {@link https://daisyui.com/components/avatar/ Контейнер аватара}
                    * @param {string} [class="placeholder"] - {@link https://daisyui.com/components/avatar/ Для показа текста в аватаре}
                    * @param {string} [class="text-neutral"] - {@link https://daisyui.com/docs/colors/ Нейтральный цвет текста}
                    * @param {string} [class="transition-all"] - {@link https://tailwindcss.com/docs/transition-property transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;}
                    * @param {string} [class="duration-200"] - {@link https://tailwindcss.com/docs/transition-duration transition-duration: 200ms;}
                    * @param {string} [class="hover:-translate-y-1"] - {@link https://tailwindcss.com/docs/translate transform: translateY(-0.25rem);}
                    *-->
                <div class="avatar placeholder text-neutral transition-all duration-200 hover:-translate-y-1">
                    <!--*
                        * Подложка иконки
                        *
                        * @param {string} [class="glass"] - {@link https://daisyui.com/docs/utilities/#-2 Эффект матового стекла}
                        * @param {string} {class="rounded-full"] - {@link https://tailwindcss.com/docs/border-radius Полное скругление}
                        * @param {string} [class="w-24"] - {@link https://tailwindcss.com/docs/width width: 6rem; /* 96px */}
                        * @param {string} [class="md:w-28"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 768px)} { {@link https://tailwindcss.com/docs/width width: 7rem; /* 112px */} }
                        * @param {string} [class="lg:w-32"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1024px)} { {@link https://tailwindcss.com/docs/width width: 8rem; /* 128px */} }
                        * @param {string} [class="xl:w-36"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1280px)} { {@link https://tailwindcss.com/docs/width width: 9rem; /* 144px */} }
                        * @param {string} [class="2xl:w-40"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1536px)} { {@link https://tailwindcss.com/docs/width width: 10rem; /* 160px */} }
                        *-->
                    <div class="glass rounded-full w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40">
                        <!--*
                            * Иконка
                            *
                            * @param {number[]} [viewBox="0 0 24 24"] - {@link https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/viewBox Координаты области просмотра SVG для текущего фрагмента SVG}
                            * @param {string} [class="fill-current"] - {@link https://tailwindcss.com/docs/fill fill: currentColor;}
                            * @param {string} [class="w-14"] - {@link https://tailwindcss.com/docs/width width: 3.5rem; /* 56px */}
                            * @param {string} [class="md:w-16"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 768px)} { {@link https://tailwindcss.com/docs/width width: 4rem; /* 64px */} }
                            * @param {string} [class="lg:w-20"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1024px)} { {@link https://tailwindcss.com/docs/width width: 5rem; /* 80px */} }
                            * @param {string} [class="xl:w-24"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1280px)} { {@link https://tailwindcss.com/docs/width width: 6rem; /* 96px */} }
                            * @param {string} [class="2xl:w-28"] - {@link https://tailwindcss.com/docs/responsive-design @media (min-width: 1536px)} { {@link https://tailwindcss.com/docs/width width: 7rem; /* 112px */} }
                            *-->
                        <svg viewBox="0 0 24 24" class="fill-current w-14 md:w-16 lg:w-20 xl:w-24 2xl:w-28">
                            <!--*
                                * Векторное представление иконки
                                *
                                * @param {string} d - {@link https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/d Этот атрибут определяет форму}
                                *-->
                            <path :d="mdi[\`\${the.favicon??'mdiWeb'}\`]"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </figure>
        <!--*
            * Контейнер контента основной карточки
            *
            * @param {string} [class="card-body"] - {@link https://daisyui.com/components/card/ Контейнер контента карточки}
            *-->
        <div v-if="the.name||the.description" class="card-body">
            <!--*
                * Контейнер заголовка основной карточки
                *
                * @param {boolean} v-if - {@link https://v3.ru.vuejs.org/ru/api/directives.html#v-if Элемент показывается, если есть имя или описание страницы}
                * @param {string} [class="card-title"] - {@link https://daisyui.com/components/card/ Заголовок карточки}
                *-->
            <div v-if="the.name" class="card-title">
                <!--*
                    * Заголовок названия страницы
                    *
                    * @param {boolean} v-if - {@link https://v3.ru.vuejs.org/ru/api/directives.html#v-if Элемент показывается, если есть имя страницы}
                    * @param {string} [class="text-ellipsis"] - {@link https://tailwindcss.com/docs/text-overflow#ellipsis text-overflow: ellipsis;}
                    * @param {string} [class="overflow-hidden"] - {@link https://tailwindcss.com/docs/overflow#hiding-content-that-overflows overflow: hidden;}
                    *-->
                <h2 v-if="the.name" class="text-ellipsis overflow-hidden">{{ the.name }}</h2>
            </div>
            <!--*
                * Описание страницы
                *
                * @param {boolean} v-if - {@link https://v3.ru.vuejs.org/ru/api/directives.html#v-if Элемент показывается, если есть описание страницы}
                * @param {string} [class="text-ellipsis"] - {@link https://tailwindcss.com/docs/text-overflow#ellipsis text-overflow: ellipsis;}
                * @param {string} [class="overflow-hidden"] - {@link https://tailwindcss.com/docs/overflow#hiding-content-that-overflows overflow: hidden;}
                *-->
            <p v-if="the.description" class="text-ellipsis overflow-hidden">{{ the.description }}</p>
        </div>
    </router-link>
</div>`,
  },
]);
const [{ value }] = options;
const model = ref(value);
</script>
<style lang="sass">
router-link
  color: var(--tw-prose-links)
  text-decoration: underline
  font-weight: 500
</style>
