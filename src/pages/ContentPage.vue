<template lang="pug">
q-drawer(v-if="s3" v-model="rightDrawer" bordered side="right")
  q-list
    q-expansion-item(group="group" icon="account_tree" label="Дерево рубрик" default-opened header-class="text-primary")
      q-tree(v-model:selected="selected" v-model:ticked="ticked" v-model:expanded="expanded" :nodes="simple" node-key="id" tick-strategy="leaf")
    q-separator
    q-expansion-item(group="group" icon="travel_explore" label="Настройки SEO" header-class="text-teal")
      q-card
        q-card-section Настройки SEO
q-page.column.full-height
  q-tabs(v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator)
    q-tab(name="wysiwyg" label="wysiwyg")
    q-tab(name="source" label="source")
  q-separator
  q-tab-panels.col.column(v-model="tab" animated)
    q-tab-panel.col.column(name="wysiwyg")
      q-editor.col.column(v-model="qeditor" content-class="col" flat placeholder="Добавьте контент на вашу страницу...")
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

const selected = ref();
const ticked = ref(["Quality ingredients", "Good table presentation"]);
const expanded = ref([
  "Satisfied customers",
  "Good service (disabled node)",
  "Pleasant surroundings",
]);
const simple = ref([
  {
    id: 1,
    label: "Satisfied customers",
    children: [
      {
        id: 2,
        label: "Good food",
        children: [
          {
            id: 3,
            label: "Quality ingredients",
          },
          {
            id: 4,
            label: "Good recipe",
          },
        ],
      },
      {
        id: 5,
        label: "Good service",
        children: [
          { id: 6, label: "Prompt attention" },
          { id: 7, label: "Professional waiter" },
        ],
      },
      {
        id: 8,
        label: "Pleasant surroundings",
        children: [
          { id: 9, label: "Happy atmosphere" },
          { id: 10, label: "Good table presentation" },
          { id: 11, label: "Pleasing decor" },
        ],
      },
    ],
  },
]);
</script>
