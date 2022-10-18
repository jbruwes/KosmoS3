<template lang="pug">
v-navigation-drawer(
  v-model="panel",
  location="right",
  :width="320",
  :temporary="mobile"
)
.tox-tinymce.fill-height
  v-tabs(v-model="tab", show-arrows, grow, density="compact")
    v-tab(value="1", prepend-icon="mdi-eye") Visual
    v-tab(value="2", prepend-icon="mdi-eye") Visual
    v-tab(value="3", prepend-icon="mdi-code-tags") Source
  v-window.fill-height(v-model="tab")
    v-window-item.fill-height(value="1", :eager="true")
      .fill-height(ref="el")
        v-stage(
          ref="stage",
          :config="stageSize",
          @mousedown="handleStageMouseDown",
          @touchstart="handleStageMouseDown"
        )
          v-layer(ref="layer")
            v-rect(
              v-for="item in rectangles",
              :key="item.id",
              :config="item",
              @transformend="handleTransformEnd"
            )
            v-transformer(ref="transformer")
    v-window-item.fill-height(value="2")
      v-wysiwyg
    v-window-item.fill-height(value="3")
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
const { panel } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref(1);
const el = ref(null);
const transformer = ref(null);
const stage = ref(null);
const { width, height } = useElementSize(el);
const stageSize = ref({ width, height });
const rectangles = ref([
  {
    rotation: 0,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: "red",
    name: "rect1",
    draggable: true,
  },
  {
    rotation: 0,
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: "green",
    name: "rect2",
    draggable: true,
  },
]);
const selectedShapeName = ref(null);
/**
 *
 * @param {object} e событие
 */
const handleTransformEnd = (e) => {
  const rect = get(rectangles).find((r) => r.name === get(selectedShapeName));
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
  if (get(rectangles).find((r) => r.name === name))
    set(selectedShapeName, name);
};
watch(selectedShapeName, (value) => {
  get(transformer)
    .getNode()
    .nodes([get(stage).getStage().findOne(`.${value}`)]);
});

onMounted(() => {
  setTimeout(() => {
    set(selectedShapeName, "rect1");
  });
});
</script>
