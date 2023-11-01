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
    q-tab-panel.column(name="css") {{ css }}
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";

import VSourceCode from "@/components/VSourceCode.vue";
import storeApp from "@/stores/app";

const { style, css } = storeToRefs(storeApp());
const tab = ref("style");
</script>
