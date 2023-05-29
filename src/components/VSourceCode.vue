<template lang="pug">
v-ace-editor.h-100(
  :value="modelValue",
  :lang="lang",
  theme="chrome",
  @update:value="$emit('update:modelValue', $event)"
)
</template>

<script setup>
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/esm-resolver";

defineProps({
  lang: { default: "html", type: String },
  modelValue: { default: "", type: String },
});
defineEmits(["update:modelValue"]);
</script>
