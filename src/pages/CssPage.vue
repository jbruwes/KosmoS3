<template lang="pug">
q-page.column.full-height
  q-tabs.text-grey(
    v-model="state.css.tab",
    dense,
    active-color="primary",
    indicator-color="primary",
    align="justify",
    narrow-indicator
  )
    q-tab(name="style", label="Style")
    q-tab(name="css", label="CSS")
  q-separator
  q-tab-panels.full-width.col(v-model="state.css.tab")
    q-tab-panel.column(name="style")
      v-source-code.col(v-model="style", lang="css")
    q-tab-panel.column(name="css")
      v-interactive-tree(
        v-model:selected="state.css.selected",
        type="url",
        :list="css",
        :selected-object="selectedObject"
      )
</template>
<script setup>
import { get, isDefined, useArrayFind, watchOnce } from "@vueuse/core";
import { storeToRefs } from "pinia";

import VInteractiveTree from "@/components/VInteractiveTree.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import app from "@/stores/app";

const { style, css, state } = storeToRefs(app());
const selectedObject = useArrayFind(
  css,
  ({ id }) => id === get(state).css.selected,
);
get(state).rightDrawer = null;
/** Инициализация */
const init = () => {
  const [{ id }] = get(css);
  const {
    css: { selected },
  } = get(state);
  if (!selected) get(state).css.selected = id;
};
if (isDefined(css)) init();
else watchOnce(css, init);
</script>
