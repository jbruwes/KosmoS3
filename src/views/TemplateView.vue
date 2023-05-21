<template lang="pug">
v-navigation-drawer(
  v-model="panel",
  location="right",
  :width="390",
  :temporary="mobile"
)
  .d-flex.h-100.flex-column
    v-tabs.flex-grow-0(v-model="drawer", grow, stacked)
      v-tab(value="1")
        v-icon mdi-format-list-bulleted-square
        | layers
      v-tab(value="2")
        v-icon mdi-move-resize
        | grid
      v-tab(value="3")
        v-icon mdi-eye
        | look
      v-tab(value="4")
        v-icon mdi-card-bulleted-settings-outline
        | classes
    v-window.h-100(v-model="drawer")
      v-window-item.overflow-y-auto(value="1")
        v-template-list
      v-window-item.overflow-y-auto(value="2")
        v-responsive-classes
      v-window-item.overflow-y-auto(value="3")
        v-look-classes
      v-window-item.overflow-y-auto(value="4")
        v-container(fluid)
          v-switch(
            v-if="item",
            v-model="item.fluid",
            :label="`Type: ${item.fluid ? 'fluid' : 'responsive'}`",
            inset,
            hide-details
          )
.rounded.border.d-flex.flex-column.flex-fill.overflow-hidden
  v-tabs.flex-grow-0(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-eye") Visual
    v-tab(value="2", prepend-icon="mdi-code-tags") Source
  v-window.d-flex.align-stretch.flex-fill(v-model="tab")
    v-window-item.flex-fill(value="1")
      v-overlay(
        v-if="item && item.name === 'content'",
        :model-value="true",
        z-index="1003",
        contained,
        persistent,
        no-click-animation
      )
      v-wysiwyg(v-if="item", v-model="item.value")
    v-window-item.flex-fill(value="2")
      v-overlay(
        v-if="item && item.name === 'content'",
        :model-value="true",
        z-index="1003",
        contained,
        persistent,
        no-click-animation
      )
      v-source-code(v-if="item", v-model="item.value")
</template>
<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/stores/kosmos3";
import template3 from "@/stores/template3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import VResponsiveClasses from "@/components/VResponsiveClasses.vue";
import VLookClasses from "@/components/VLookClasses.vue";
import VTemplateList from "@/components/VTemplateList.vue";

const store = kosmos3();
const localStore = template3();
const { panel } = storeToRefs(store);
const { item } = storeToRefs(localStore);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref(1);
const drawer = ref(1);
</script>

<style scoped>
:deep(.v-window__container) {
  flex: 1 1 auto !important;
}
</style>
