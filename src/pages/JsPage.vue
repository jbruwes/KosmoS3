<template lang="pug">
q-page.column.full-height
  q-tabs.text-grey(
    v-model="state.js.tab",
    dense,
    active-color="primary",
    indicator-color="primary",
    align="justify",
    narrow-indicator
  )
    q-tab(name="script", label="Script")
    q-tab(name="js", label="JS")
  q-separator
  q-tab-panels.full-width.col(v-model="state.js.tab")
    q-tab-panel.column(name="script")
      v-source-code.col(v-model="script", lang="javascript")
    q-tab-panel.column(name="js")
      v-interactive-tree(
        v-model:selected="state.js.selected",
        type="url",
        :list="js",
        :selected-object="selectedObject"
      )
</template>
<script setup>
import { get, isDefined, useArrayFind, watchOnce } from "@vueuse/core";
import { storeToRefs } from "pinia";

import VInteractiveTree from "@/components/VInteractiveTree.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import app from "@/stores/app";

const { script, js, state } = storeToRefs(app());
const selectedObject = useArrayFind(
  js,
  ({ id }) => id === get(state, "js").selected,
);
get(state).rightDrawer = null;
/** Инициализация */
const init = () => {
  const [{ id }] = get(js);
  const {
    js: { selected },
  } = get(state);
  if (!selected) get(state).js.selected = id;
};
if (isDefined(js)) init();
else watchOnce(js, init);
</script>
