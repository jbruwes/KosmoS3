<template lang="pug">
q-drawer(v-if="s3" v-model="rightDrawer" bordered side="right")
q-page.column.full-height
  q-tabs(v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator)
    q-tab(name="wysiwyg" label="wysiwyg")
    q-tab(name="source" label="source")
  q-separator
  q-tab-panels.col.column(v-model="tab" animated)
    q-tab-panel.col.column(name="wysiwyg")
      q-editor.col.column.q-ma-md(v-model="qeditor" content-class="col")
    q-tab-panel.col.column(name="source")
      v-ace-editor.col(v-model="qeditor" lang="html" theme="chrome")
</template>
<script setup>
import "ace-builds/esm-resolver";

import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { VAceEditor } from "vue3-ace-editor";

import app from "@/stores/app";

const store = app();
const { s3, rightDrawer } = storeToRefs(store);
set(rightDrawer, true);
const qeditor = ref("");
const tab = ref("wysiwyg");
</script>
