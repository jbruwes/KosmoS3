<template lang="pug">
.rounded.border.d-flex.flex-column.flex-fill.overflow-hidden
  v-tabs.flex-grow-0(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-format-list-bulleted") JavaScript File URLs
    v-tab(value="2", prepend-icon="mdi-text-box-outline") Function and Global Variable Declaration
  v-window.d-flex.flex-fill(v-model="tab")
    v-window-item.flex-fill.overflow-y-auto(value="1")
      v-container(fluid)
        draggable(v-model="js", item-key="id")
          template(#item="{ element, index }")
            v-text-field(
              v-if="element",
              v-model.trim="element.url",
              variant="underlined",
              append-inner-icon="mdi-plus-circle-outline",
              prepend-inner-icon="mdi-minus-circle-outline",
              append-icon="mdi-drag-vertical",
              @click:prepend-inner="js.length - 1 && js.splice(index, 1)",
              @click:append-inner="js.splice(index + 1, 0, { url: '', id: uuid() })"
            )
    v-window-item.flex-fill(value="2")
      v-source-code(v-model="script", lang="javascript")
</template>
<script setup>
import { ref } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import app from "@/store/app";
import VSourceCode from "@/components/VSourceCode.vue";

const store = app();
const { panel, js, script } = storeToRefs(store);
set(panel, null);
const tab = ref("1");
/** @returns {string} uuid */
const uuid = () => crypto.randomUUID();
</script>

<style scoped>
:deep(.v-window__container) {
  flex: 1 1 auto !important;
}
</style>
