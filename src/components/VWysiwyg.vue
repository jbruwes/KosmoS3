<template lang="pug">
div
  q-editor.col.column.full-width( ref="editorRef" :dense="$q.screen.lt.md" :model-value="modelValue" :toolbar="editorTlb" :fonts="editorFnt" content-class="col prose max-w-none" flat placeholder="Добавьте контент на вашу страницу..." :definitions="editorDef" @update:model-value="$emit('update:modelValue', $event)" @paste="capture" @drop="capture")
  q-dialog(v-model="prompt" full-width full-height persistent)
    q-card.column
      q-card-section.row.items-center.q-pb-none
        .text-h6 Выбор компонента для вставки
        q-space
        q-btn(v-close-popup icon="close" flat round dense)
      q-card-section
        q-select(v-model="model" filled :options="options" label="Компонент" emit-value map-options)
      q-card-section.col.column
        q-card.col.column(flat bordered)
          q-card-section.col.column
            // eslint-disable-next-line vue/no-v-html
            .col(v-html="model")
      q-card-actions.text-primary(align="right")
        q-btn(v-close-popup flat label="Отмена")
        q-btn(v-close-popup flat label="Ok"  @click="editorRef.runCmd('insertHTML', model)")
</template>

<script setup>
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

import { get, set, useFileDialog } from "@vueuse/core";
import * as mime from "mime-types";
import { storeToRefs } from "pinia";
import { uid, useQuasar } from "quasar";
import { reactive, ref, watch } from "vue";

import app from "@/stores/app";

defineProps({ modelValue: { default: "", type: String } });
defineEmits(["update:modelValue"]);
const prompt = ref(false);
const $q = useQuasar();
const store = app();
const { base } = storeToRefs(store);
const { putFile } = store;
const editorRef = ref();
/**
 * { @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types }
 * @param { object } file - файл
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
      get(editorRef).runCmd("insertImage", `${get(base)}${filePath}`);
    } else
      throw new Error(
        "Тип графического файла не подходит для использования в сети интернет",
      );
  } catch (err) {
    const { message } = err;
    $q.notify({ message });
  }
};
/**
 * @param {object} evt - объект события
 */
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
    /**
     *
     */
    handler() {
      set(prompt, true);
    },
  },
  h1: {
    cmd: "formatBlock",
    param: "H1",
    icon: i.heading1 || i.heading,
    tip: e.heading1,
    htmlTip: `<span class="prose"><h1 class="q-ma-none">${e.heading1}</h1></span>`,
  },
  h2: {
    cmd: "formatBlock",
    param: "H2",
    icon: i.heading2 || i.heading,
    tip: e.heading2,
    htmlTip: `<span class="prose"><h2 class="q-ma-none">${e.heading2}</h2></span>`,
  },
  h3: {
    cmd: "formatBlock",
    param: "H3",
    icon: i.heading3 || i.heading,
    tip: e.heading3,
    htmlTip: `<span class="prose"><h3 class="q-ma-none">${e.heading3}</h3></span>`,
  },
  h4: {
    cmd: "formatBlock",
    param: "H4",
    icon: i.heading4 || i.heading,
    tip: e.heading4,
    htmlTip: `<span class="prose"><h4 class="q-ma-none">${e.heading4}</h4></span>`,
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

        "arsenal",
        "bad_script",
        "caveat",
        "comfortaa",
        "cormorant_garamond",
        "cormorant_infant",
        "cormorant_sc",
        "cormorant_unicase",
        "cormorant",
        "jura",
        "marck_script",
        "montserrat",
        "montserrat_alternates",
        "open_sans_condensed",
        "open_sans",
        "oswald",
        "pattaya",
        "poiret_one",
        "roboto_condensed",
        "roboto_mono",
        "roboto_slab",
        "roboto",
        "rubik_mono_one",
        "rubik",
        "tenor_sans",
      ],
    },
    "removeFormat",
  ],
  ["quote", "unordered", "ordered", "outdent", "indent"],
  ["undo", "redo"],
  ["upload", "template"],
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

  arsenal: "Arsenal",
  bad_script: "Bad Script",
  caveat: "Caveat",
  comfortaa: "Comfortaa",
  cormorant_garamond: "Cormorant Garamond",
  cormorant_infant: "Cormorant Infant",
  cormorant_sc: "Cormorant SC",
  cormorant_unicase: "Cormorant Unicase",
  cormorant: "Cormorant",
  jura: "Jura",
  marck_script: "Marck Script",
  montserrat: "Montserrat",
  montserrat_alternates: "Montserrat Alternates",
  open_sans_condensed: "Open Sans Condensed",
  open_sans: "Open Sans",
  oswald: "Oswald",
  pattaya: "Pattaya",
  poiret_one: "Poiret One",
  roboto_condensed: "Roboto Condensed",
  roboto_mono: "Roboto Mono",
  roboto_slab: "Roboto Slab",
  roboto: "Roboto",
  rubik_mono_one: "Rubik Mono One",
  rubik: "Rubik",
  tenor_sans: "Tenor Sans",
});
const options = reactive([
  {
    label: "Компонент №1",
    value: "<b>Компонент №1</b>",
  },
  {
    label: "Компонент №2",
    value: "<b>Компонент №2</b>",
  },
]);
const [{ value }] = options;
const model = ref(value);
</script>
