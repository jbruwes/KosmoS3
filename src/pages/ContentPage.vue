<template lang="pug">
q-drawer(v-if="s3" v-model="rightDrawer" bordered side="right")
q-page.column.full-height
  q-tabs(v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator)
    q-tab(name="wysiwyg" label="wysiwyg")
    q-tab(name="source" label="source")
  q-separator
  q-tab-panels.col.column(v-model="tab" animated)
    q-tab-panel.col.column(name="wysiwyg")
      q-editor.col.column(v-model="qeditor" content-class="col" flat)
    q-tab-panel.col.column(name="source")
      v-ace-editor.col(v-model:value="source" lang="html")
</template>
<script setup>
// eslint-disable-next-line simple-import-sort/imports
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/esm-resolver";

import { set, get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { html_beautify as htmlBeautify } from "js-beautify";
import app from "@/stores/app";

const store = app();
const { s3, rightDrawer } = storeToRefs(store);
set(rightDrawer, true);
const qeditor = ref("");
const tab = ref("wysiwyg");
const source = computed({
  /**
   * Прихорашивание html
   * @returns {string} - красивый исходный код
   */
  get() {
    return htmlBeautify(get(qeditor));
  },
  /**
   *
   * @param {string} newValue - отредактрованное значение
   */
  set(newValue) {
    set(qeditor, newValue);
  },
});
</script>
