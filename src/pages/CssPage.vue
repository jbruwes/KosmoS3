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
    q-tab(name="style", label="Style")
    q-tab(name="css", label="CSS")
  q-separator
  q-tab-panels.full-width.col(v-model="tab")
    q-tab-panel.column(name="style")
      v-source-code.col(v-model="style", lang="css")
    q-tab-panel.column(name="css")
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
import styleStore from "@/stores/style";

const { rightDrawer } = storeToRefs(storeApp());
const { css, style, selected, list, selectedObject, tab } =
  storeToRefs(styleStore());
set(rightDrawer, null);
/** Инициализация */
const init = () => {
  const [{ id }] = get(css);
  set(selected, id);
};
if (isDefined(css)) init();
else whenever(css, init);
</script>
