<template lang="pug">
q-page.column.full-height
  q-tabs.text-grey(
    v-model="tab",
    dense,
    active-color="primary",
    indicator-color="primary",
    align="justify",
    narrow-indicator
  )
    q-tab(name="script", label="Script")
    q-tab(name="js", label="JS")
  q-separator
  q-tab-panels.full-width.col(v-model="tab")
    q-tab-panel.column(name="script")
      v-source-code.col(v-model="script", lang="javascript")
    q-tab-panel.column(name="js")
      v-interactive-tree(
        v-model:selected="selected",
        type="url",
        :list="list",
        :selected-object="selectedObject"
      )
</template>
<script setup>
import { get, isDefined, set, whenever } from "@vueuse/core";
import { storeToRefs } from "pinia";

import VInteractiveTree from "@/components/VInteractiveTree.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import storeApp from "@/stores/app";
import scriptStore from "@/stores/script";

const { rightDrawer } = storeToRefs(storeApp());
const { js, script, selected, list, selectedObject, tab } =
  storeToRefs(scriptStore());
set(rightDrawer, null);
/** Инициализация */
const init = () => {
  const [{ id }] = get(js);
  set(selected, id);
};
if (isDefined(js)) init();
else whenever(js, init);
</script>
