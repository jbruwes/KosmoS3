<template lang="pug">
v-navigation-drawer(
  v-model="panel",
  location="right",
  :width="320",
  :temporary="mobile"
)
  v-tabs(v-model="drawer", :grow="true", stacked)
    v-tab(value="1")
      v-icon mdi-format-list-bulleted-square
    v-tab(value="2")
      v-icon mdi-move-resize
  v-window(v-model="drawer")
    v-window-item(value="1", :eager="true")
      v-container.h-100.pa-0(fluid)
        v-template-list
    v-window-item(value="2")
      v-container.h-100(fluid)
        v-row.mx-0.mt-1.mb-3
          v-btn-toggle.flex-grow-1(
            v-model="template[curIndex].params.position",
            mandatory,
            variant="outlined",
            divided
          )
            v-btn.flex-grow-1(
              prepend-icon="mdi-format-wrap-top-bottom",
              stacked,
              size="small"
            ) static
            v-btn.flex-grow-1(
              prepend-icon="mdi-format-wrap-square",
              stacked,
              size="small"
            ) absolute
            v-btn.flex-grow-1(
              prepend-icon="mdi-format-wrap-tight",
              stacked,
              size="small"
            ) fixed
        v-switch(
          v-model="template[curIndex].params.responsive",
          :label="`Type: ${template[curIndex].params.responsive ? 'responsive' : 'fluid'}`",
          inset,
          :hide-details="true"
        )
        v-range-slider.mt-8(
          v-model="template[curIndex].params.width",
          step="1",
          strict,
          thumb-label="always"
        )
        v-range-slider.mt-8(
          v-model="template[curIndex].params.height",
          step="1",
          strict,
          thumb-label="always"
        )
.rounded.border.d-flex.flex-column.flex-fill.overflow-hidden
  v-tabs(v-model="tab", show-arrows, grow)
    v-tab.h-100(value="1", prepend-icon="mdi-ungroup") Layout
    v-tab.h-100(value="2", prepend-icon="mdi-eye") Visual
    v-tab.h-100(value="3", prepend-icon="mdi-code-tags") Source
  v-window.d-flex.align-stretch.flex-fill.h-100(v-model="tab")
    v-window-item.flex-fill.h-100.overflow-y-auto(ref="fluidContainer", value="1")
      v-konva
    v-window-item.flex-fill(value="2")
      v-wysiwyg(v-model="template[curIndex].params.value")
    v-window-item.flex-fill(value="3")
      v-source-code(v-model="template[curIndex].params.value")
</template>
<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { get, set, useElementSize, useScroll, syncRefs } from "@vueuse/core";
import { storeToRefs } from "pinia";
import app from "@/store/app";
import TemplateStore from "@/store/templateStore";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import VKonva from "@/components/VKonva.vue";
import VTemplateList from "@/components/VTemplateList.vue";

const store = app();
const templateStore = TemplateStore();
const { panel, template } = storeToRefs(store);
const {
  itemIndex: curIndex,
  konvaWidth,
  konvaHeight,
  scrollY,
} = storeToRefs(templateStore);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref("1");
const drawer = ref("1");
const fluidContainer = ref();
const { width: fluidContainerWidth, height: fluidContainerHeight } =
  useElementSize(fluidContainer);
const { y: fluidContainerScrollY } = useScroll(fluidContainer);
syncRefs(fluidContainerWidth, konvaWidth);
syncRefs(fluidContainerHeight, konvaHeight);
syncRefs(fluidContainerScrollY, scrollY);
</script>
<style scoped>
:deep(.v-window__container) {
  flex: 1 1 auto !important;
  width: 100%;
}
</style>
