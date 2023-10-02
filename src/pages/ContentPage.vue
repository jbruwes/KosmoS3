<template lang="pug">
q-drawer(v-if="s3" v-model="rightDrawer" bordered side="right")
  q-list
    q-expansion-item(group="group" icon="account_tree" label="Дерево рубрик" default-opened header-class="text-primary")
      q-btn-group.q-mx-xs(spread flat)
        q-btn(icon="note")
        q-btn(icon="delete")
        q-btn(icon="chevron_left")
        q-btn(icon="chevron_right")
        q-btn(icon="expand_more")
        q-btn(icon="expand_less")
      q-tree.q-ma-xs(v-model:selected="selected" v-model:expanded="expanded" :nodes="content??[]" node-key="id" no-selection-unset accordion)
        template(#default-header="prop")
          div {{prop.node.label}}
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

import { set, get, whenever, isDefined } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { html_beautify as htmlBeautify } from "js-beautify";
import app from "@/stores/app";

const store = app();
const { s3, rightDrawer, content } = storeToRefs(store);
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
/**
 *
 */
const setSelected = () => {
  if (isDefined(content)) {
    const { id } = get(content, 0);
    set(selected, id);
  }
};
setSelected();
whenever(content, setSelected);
const expanded = ref([]);
/**
 *
 */
const setExpanded = () => {
  if (isDefined(content)) {
    const { id } = get(content, 0);
    set(expanded, [id]);
  }
};
setExpanded();
whenever(content, setExpanded);
</script>
