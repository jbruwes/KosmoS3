<template lang="pug">
q-editor( ref="editorRef" :dense="$q.screen.lt.md" :model-value="modelValue" :toolbar="editorTlb" :fonts="editorFnt" content-class="col" flat placeholder="Добавьте контент на вашу страницу..." :definitions="editorDef" @update:model-value="$emit('update:modelValue', $event)" @paste="pasteCapture" @drop="dropCapture")
</template>

<script setup>
import { get, useFileDialog } from "@vueuse/core";
import * as mime from "mime-types";
import { useQuasar } from "quasar";
import { reactive, ref, watch } from "vue";

import app from "@/stores/app";

defineProps({ modelValue: { default: "", type: String } });
defineEmits(["update:modelValue"]);
const $q = useQuasar();
const store = app();
const { putFile, base } = store;
const editorRef = ref();

const mTypes = [
  "image/apng",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const { files, open } = useFileDialog({
  multiple: false,
  accept: "image/*",
});
/**
 *
 * @param item
 */
const putImage = async (file) => {
  try {
    const { type } = file;
    if (mTypes.includes(type)) {
      const filePath = `image/${crypto.randomUUID()}.${mime.extension(type)}`;
      await putFile(filePath, type, file);
      get(editorRef).runCmd("insertImage", `${base}${filePath}`);
    } else
      throw new Error(
        "Тип файла не подходит для использования в сети интернет",
      );
  } catch (err) {
    const { message } = err;
    $q.notify({ message });
  }
};
watch(files, (newFiles) => {
  if (newFiles.length) {
    const [file] = newFiles;
    putImage(file);
  }
});
/**
 *
 */
const editorDef = reactive({
  upload: {
    tip: "Загрузка картинки",
    icon: "cloud_upload",
    /** */
    handler() {
      open();
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
      ],
    },
    "removeFormat",
  ],
  ["quote", "unordered", "ordered", "outdent", "indent"],

  ["undo", "redo"],
  ["upload"],
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
});

/**
 * { @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types }
 * @param {object} evt - объект события
 */
const pasteCapture = (evt) => {
  const clipboardData =
    evt?.originalEvent?.clipboardData ||
    evt?.clipboardData ||
    window?.clipboardData;

  if (!clipboardData.getData("text")) {
    evt.preventDefault();
    evt.stopPropagation();
    const { items = [] } = clipboardData;
    [...items].forEach((item) => {
      putImage(item.getAsFile());
    });
  }
};
/**
 *
 * @param evt
 */
const dropCapture = (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  console.log("dropCapture", evt);
};
</script>
