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
      q-tree.q-ma-xs(ref="tree" v-model:selected="selected" v-model:expanded="expanded" :nodes="content??[]" node-key="id" no-selection-unset accordion)
        template(#default-header="prop")
          q-checkbox.q-mr-xs(v-model="prop.node.visible" dense)
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
  q-tab-panels.col.column(v-model="tab")
    q-tab-panel.col.column(name="wysiwyg")
      v-wysiwyg.col.column(v-model="selectedValue")
    q-tab-panel.col.column(name="source")
      v-source-code.col(v-model="source")
</template>
<script setup>
import { get, isDefined, set, whenever } from "@vueuse/core";
import { html_beautify as htmlBeautify } from "js-beautify";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import VSourceCode from "@/components/VSourceCode.vue";
import VWysiwyg from "@/components/VWysiwyg.vue";
import app from "@/stores/app";

const store = app();
const { s3, rightDrawer, content, selected, expanded } = storeToRefs(store);
set(rightDrawer, true);
const tab = ref("wysiwyg");
const tree = ref();
const selectedValue = computed({
  /**
   *
   */
  get() {
    const { value = "" } = get(get(tree)?.getNodeByKey(get(selected))) ?? {};
    return value;
  },
  /**
   *
   * @param value
   */
  set(value) {
    get(get(tree)?.getNodeByKey(get(selected))).value = value;
  },
});
const source = computed({
  /**
   * Прихорашивание html
   * @returns {string} - красивый исходный код
   */
  get() {
    return htmlBeautify(get(selectedValue));
  },
  /**
   *
   * @param {string} newValue - отредактрованное значение
   */
  set(newValue) {
    set(selectedValue, newValue);
  },
});
whenever(content, () => {
  if (isDefined(content)) {
    const { id } = get(content, 0);
    set(selected, id);
  }
});
whenever(content, () => {
  if (isDefined(content)) {
    const { id } = get(content, 0);
    set(expanded, [id]);
  }
});
</script>
