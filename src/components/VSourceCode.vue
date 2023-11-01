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
import { get } from "@vueuse/core";
import { onMounted } from "vue";
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
onMounted(() => {
  let code;
  switch (props.lang) {
    case "javascript":
      code = jsBeautify(get(props.modelValue));
      break;
    case "css":
      code = cssBeautify(get(props.modelValue));
      break;
    default:
      code = htmlBeautify(get(props.modelValue));
      break;
  }
  emits("update:modelValue", code);
});
</script>
