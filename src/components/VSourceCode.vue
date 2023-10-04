<template lang="pug">
v-ace-editor(:value="modelValue" :lang="lang" @update:value="$emit('update:modelValue', $event)")
</template>

<script setup>
// eslint-disable-next-line simple-import-sort/imports
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/esm-resolver";

defineProps({
  lang: { default: "html", type: String },
  modelValue: { default: "", type: String },
});
defineEmits(["update:modelValue"]);
</script>
