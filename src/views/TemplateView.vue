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
      v-icon mdi-card-bulleted-settings-outline
  v-window(v-model="drawer")
    v-window-item(value="1")
      v-container.h-100(fluid) tree
    v-window-item(value="2")
      v-container.h-100(fluid) attrs
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-ungroup") Layout
    v-tab(value="2", prepend-icon="mdi-eye") Visual
    v-tab(value="3", prepend-icon="mdi-code-tags") Source
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1", :eager="true")
      .h-100(ref="el")
        iframe.h-100.w-100.border-0
        // eslint-disable-next-line
        v-overlay(:model-value="true", :scrim="false", :zIndex="1", contained, persistent, no-click-animation)
          v-stage(
            ref="stage",
            :config="{ width, height }",
            @mousedown="handleStageMouseDown",
            @touchstart="handleStageMouseDown"
          )
            v-layer(ref="layer")
              v-rect(
                v-for="item in template",
                :key="item.id",
                :config="item",
                @transformend="handleTransformAndDragEnd",
                @dragend="handleTransformAndDragEnd"
              )
              v-transformer(
                ref="transformer",
                :config="{ flipEnabled: false }"
              )
    v-window-item.h-100(value="2")
      v-wysiwyg
    v-window-item.h-100(value="3")
      v-source-code
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useDisplay } from "vuetify";
import { get, set, useElementSize } from "@vueuse/core";
import { storeToRefs } from "pinia";
import Konva from "konva";
import kosmos3 from "@/kosmos3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, template } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref(1);
const drawer = ref(1);
const el = ref();
const transformer = ref();
const stage = ref();
const { width, height } = useElementSize(el);
const selectedShapeName = ref();
/**
 *
 * @param {object} e событие
 */
const handleTransformAndDragEnd = (e) => {
  const name = e.target.name();
  const rect = get(template).find((r) => r.name === name);
  rect.x = e.target.x();
  rect.y = e.target.y();
  rect.rotation = e.target.rotation();
  rect.scaleX = e.target.scaleX();
  rect.scaleY = e.target.scaleY();
  rect.fill = Konva.Util.getRandomColor();
};
/**
 *
 * @param {object} e событие
 */
const handleStageMouseDown = (e) => {
  const name = e.target.name();
  if (get(template).find((r) => r.name === name)) set(selectedShapeName, name);
};
watch(selectedShapeName, (value) => {
  get(transformer)
    .getNode()
    .nodes([get(stage).getStage().findOne(`.${value}`)]);
});

onMounted(() => {
  setTimeout(() => {
    set(selectedShapeName, get(template, 0).name);
  });
});
</script>
