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
      v-interactive-tree(v-model:selected="selected", type="url", :list="css")
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";

import VInteractiveTree from "@/components/VInteractiveTree.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import storeApp from "@/stores/app";

const { style, css } = storeToRefs(storeApp());
const tab = ref("style");
const selected = ref();
</script>
