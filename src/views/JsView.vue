<template lang="pug">
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow, density="compact")
    v-tab(value="1", prepend-icon="mdi-format-list-bulleted") JavaScript File URLs
    v-tab(value="2", prepend-icon="mdi-text-box-outline") Function and Global Variable Declaration
  v-window.h-100(v-model="tab")
    v-window-item.h-100.overflow-y-auto(value="1")
      v-container(fluid)
        draggable(v-model="js", item-key="id")
          template(#item="{ element, index }")
            v-text-field(
              v-model.trim="element.url",
              variant="underlined",
              append-inner-icon="mdi-plus-circle-outline",
              prepend-inner-icon="mdi-minus-circle-outline",
              append-icon="mdi-drag-vertical",
              @click:prepend-inner="js.length - 1 && js.splice(index, 1)",
              @click:append-inner="js.splice(index + 1, 0, { url: '', id: uuid() })"
            )
    v-window-item.h-100(value="2")
      v-source-code(v-model="script", lang="javascript")
</template>
<script setup>
import { ref } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import kosmos3 from "@/kosmos3";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, js, script } = storeToRefs(store);
set(panel, null);
const tab = ref(1);
/** @returns {string} uuid */
const uuid = () => crypto.randomUUID();
</script>
