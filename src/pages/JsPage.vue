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
    q-tab-panel.column(name="js") {{ js }}
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";

import VSourceCode from "@/components/VSourceCode.vue";
import storeApp from "@/stores/app";

const { script, js } = storeToRefs(storeApp());
const tab = ref("script");
</script>
