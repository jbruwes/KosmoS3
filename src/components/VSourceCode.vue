<template>
  <v-ace-editor
    v-model:value="content"
    lang="html"
    theme="chrome"
    style="height: 100%"
  ></v-ace-editor>
</template>

<script setup>
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/webpack-resolver";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";

const store = kosmos3();
const { content } = storeToRefs(store);
</script>
