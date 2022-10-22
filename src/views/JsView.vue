<template lang="pug">
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow, density="compact")
    v-tab(value="1", prepend-icon="mdi-format-list-bulleted") JavaScript File URLs
    v-tab(value="2", prepend-icon="mdi-text-box-outline") Function and Global Variable Declaration
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1")
      v-container(fluid)
        draggable(v-model="javascripts", item-key="id")
          template(#item="{ element, index }")
            v-text-field(
              v-model="element.value",
              variant="underlined",
              append-inner-icon="mdi-plus",
              prepend-inner-icon="mdi-minus",
              append-icon="mdi-drag-vertical",
              @click:prepend-inner="javascripts.length - 1 && javascripts.splice(index, 1)",
              @click:append-inner="javascripts.splice(index + 1, 0, { value: '', id: uuid() })"
            )
    v-window-item.h-100(value="2")
      v-source-code(v-model.trim="javascript", lang="javascript")
</template>
<script setup>
import { ref } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import kosmos3 from "@/kosmos3";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, javascripts, javascript } = storeToRefs(store);
set(panel, null);
const tab = ref(1);
/** @returns {string} uuid */
const uuid = () => crypto.randomUUID();
</script>
