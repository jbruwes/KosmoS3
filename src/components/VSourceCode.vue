<template>
  <v-ace-editor
    :value="modelValue"
    :lang="lang"
    theme="chrome"
    style="height: 100%"
    @update:value="$emit('update:modelValue', $event)"
  ></v-ace-editor>
</template>

<script setup>
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/webpack-resolver";

defineProps({
  lang: { default: "html", type: String },
  modelValue: { default: "", type: String },
});
defineEmits(["update:modelValue"]);
</script>
