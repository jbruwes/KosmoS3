<template lang="pug">
div
  q-editor.col.column.full-width( ref="editorRef" :dense="$q.screen.lt.md" :model-value="modelValue" :toolbar="editorTlb" :fonts="editorFnt" content-class="col" flat placeholder="Добавьте контент на вашу страницу..." :definitions="editorDef" @update:model-value="$emit('update:modelValue', $event)" @paste="capture" @drop="capture")
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
        q-btn(v-close-popup flat label="Ок"  @click="editorRef.runCmd('insertHTML', model)")
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
import { useQuasar } from "quasar";
import { reactive, ref, watch } from "vue";

import app from "@/stores/app";

defineProps({ modelValue: { default: "", type: String } });
defineEmits(["update:modelValue"]);
const prompt = ref(false);
const $q = useQuasar();
const store = app();
const { putFile, base } = store;
const editorRef = ref();
/**
 * { @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types }
 */
const mTypes = [
  "image/apng",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];
/**
 * @param { object } file - файл
 */
const putImage = async (file) => {
  try {
    const { type } = file;
    if (mTypes.includes(type)) {
      const filePath = `images/${crypto.randomUUID()}.${mime.extension(type)}`;
      await putFile(filePath, type, file);
      get(editorRef).runCmd("insertImage", `${base}${filePath}`);
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
});
const editorTlb = reactive([
  ["left", "center", "right", "justify"],
  ["bold", "italic", "strike", "underline", "subscript", "superscript"],
  ["token", "hr", "link", "custom_btn"],
  ["print", "fullscreen"],
  [
    {
      label: $q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: "no-icons",
      options: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"],
    },
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
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
      label: $q.lang.editor.defaultFont,
      icon: $q.iconSet.editor.font,
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
