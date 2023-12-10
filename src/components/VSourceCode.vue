<template lang="pug">
v-ace-editor(
  :value="modelValue",
  :lang="lang",
  @update:value="$emit('update:modelValue', $event)"
)
</template>

<script setup>
// eslint-disable-next-line simple-import-sort/imports
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/esm-resolver";
import { onMounted } from "vue";
import { get, watchOnce } from "@vueuse/core";

import {
  js_beautify as jsBeautify,
  css_beautify as cssBeautify,
  html_beautify as htmlBeautify,
} from "js-beautify";

const props = defineProps({
  lang: { default: "html", type: String },
  modelValue: { default: "", type: String },
});
const emits = defineEmits(["update:modelValue"]);
/** @param {string} value - Исходный код */
const beautify = (value) => {
  let code;
  switch (props.lang) {
    case "javascript":
      code = jsBeautify(value);
      break;
    case "css":
      code = cssBeautify(value);
      break;
    default:
      code = htmlBeautify(value);
      break;
  }
  emits("update:modelValue", code);
};
watchOnce(
  () => props.modelValue,
  (value, oldValue) => {
    if (!oldValue && value) beautify(value);
  },
);
onMounted(() => {
  if (get(props.modelValue)) beautify(get(props.modelValue));
});
</script>
