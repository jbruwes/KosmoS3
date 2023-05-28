<template lang="pug">
v-navigation-drawer(
  v-model="panel",
  location="right",
  :width="390",
  :temporary="mobile"
)
  v-tabs(v-model="drawer", :grow="true", stacked)
    v-tab(value="1")
      v-icon mdi-file-tree
    v-tab(value="2")
      v-icon mdi-card-bulleted-settings-outline
  v-window(v-model="drawer")
    v-window-item(value="1")
      v-container(fluid) tree
    v-window-item(value="2")
      v-container(fluid) attrs
.rounded.border.d-flex.flex-column.flex-fill.overflow-hidden
  v-tabs.flex-grow-0(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-eye") Visual
    v-tab(value="2", prepend-icon="mdi-code-tags") Source
  v-window.d-flex.align-stretch.flex-fill(v-model="tab")
    v-window-item.flex-fill(value="1")
      v-wysiwyg(v-model="content")
    v-window-item.flex-fill(value="2")
      v-source-code(v-model="content")
</template>

<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import app from "@/store/app";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";

const store = app();
const { panel } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const content = ref("");
const tab = ref("1");
const drawer = ref("1");
</script>

<style scoped>
:deep(.v-window__container) {
  flex: 1 1 auto !important;
}
</style>
