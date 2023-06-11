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
  v-tabs.flex-grow-0(v-model="tab", show-arrows, grow)
    v-tab.h-100(value="1", prepend-icon="mdi-ungroup") Layout
    v-tab.h-100(value="2", prepend-icon="mdi-eye") Visual
    v-tab.h-100(value="3", prepend-icon="mdi-code-tags") Source
  v-window.d-flex.align-stretch.flex-fill.h-100(v-model="tab")
    v-window-item.flex-fill.h-100.overflow-y-auto(ref="fluidContainer", value="1")
      .position-relative.solid-lines(
        :style="{ 'background-size': `23px ${100 / cntStatic}%` }"
      )
        v-overlay(
          :model-value="true",
          :scrim="false",
          z-index="0",
          contained,
          persistent,
          no-click-animation,
          content-class="w-100 h-100"
        )
          v-container.h-100.pa-0.border-s-xl.border-e-xl.border-dashed.border-t-0.border-b-0(
            ref="responsiveContainer"
          )
        v-stage(
          ref="stage",
          :config="{ width: konvaWidth, height: fullHeight }",
          @mousedown="handleStageMouseDown",
          @touchstart="handleStageMouseDown"
        )
          v-layer
            v-rect(
              v-for="item in reverse(visibleTemplate)",
              :key="item.id",
              :config="item",
              @transform="update",
              @dragmove="update",
            )
            v-transformer(ref="transformer", :config="configTransform")
    v-window-item.flex-fill(value="2")
      v-wysiwyg(v-model="template[curIndex].params.value")
    v-window-item.flex-fill(value="3")
      v-source-code(v-model="template[curIndex].params.value")
</template>
<script setup>
import { ref, watch, computed, nextTick, onMounted } from "vue";
import { useDisplay } from "vuetify";
import {
  get,
  set,
  useElementSize,
  useScroll,
  syncRefs,
  watchTriggerable,
  isDefined,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import app from "@/store/app";
import TemplateStore from "@/store/TemplateStore";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import VTemplateList from "@/components/VTemplateList.vue";

const store = app();
const templateStore = TemplateStore();
const { panel, template } = storeToRefs(store);
const {
  itemId: curId,
  itemIndex: curIndex,
  konvaWidth,
  konvaHeight,
  realResponsiveWidth,
  scrollY,
  visibleTemplate,
  cntStatic,
  fullHeight,
} = storeToRefs(templateStore);
const { calcXPct, calcYPct, normLayer } = templateStore;
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref("1");
const drawer = ref("1");
const fluidContainer = ref();
const responsiveContainer = ref();
const transformer = ref();
const stage = ref();
/**
 * реверсируем слои в шаблоне
 * @param { Array } value - массив слоев
 * @returns {Array} - реверсивный массив слоев
 */
function reverse(value) {
  return [...(value ?? [])].reverse();
}
/**
 *
 * @param {object} e событие
 */
const update = (e) => {
  const item = get(template).find(({ id }) => id === e.target.id());
  const { x, y, width, height } = e.target.getClientRect();
  item.x = x;
  item.y = y;
  item.scaleX = width;
  item.scaleY = height;
};
const { width: fluidContainerWidth, height: fluidContainerHeight } =
  useElementSize(fluidContainer);
const { width: responsiveContainerWidth } = useElementSize(responsiveContainer);
const { y: fluidContainerScrollY } = useScroll(fluidContainer);
syncRefs(fluidContainerWidth, konvaWidth);
syncRefs(fluidContainerHeight, konvaHeight);
syncRefs(responsiveContainerWidth, realResponsiveWidth);
syncRefs(fluidContainerScrollY, scrollY);

const configTransform = {
  flipEnabled: false,
  rotateEnabled: false,
  /**
   * проверка невыхода за габариты при изменении размеров
   * @param {object} oldBox старые размеры
   * @param {object} newBox новые размеры
   * @returns {object} разрешенные размеры
   */
  boundBoxFunc(oldBox, newBox) {
    const [
      { attrs: { params: { responsive, position, index } = {} } = {} } = {},
    ] = get(transformer).getNode().nodes();
    const { x, y, height, width } = newBox;
    const top = calcYPct(y, position, index);
    const bottom = top + calcYPct(height, position);
    const left = calcXPct(x, responsive);
    const right = left + calcXPct(width, -responsive);
    return left.toFixed(2) < 0 ||
      top.toFixed(2) < 0 ||
      right.toFixed(2) > 100 ||
      bottom.toFixed(2) > 100
      ? oldBox
      : newBox;
  },
};
/**
 *
 * @param {object} e событие
 */
const handleStageMouseDown = (e) => {
  const targetId = e.target.id();
  if (get(template).find(({ id }) => id === targetId)) set(curId, targetId);
};
/**
 * установка рамки трансформера
 * @param {string} value текущий идентификатор слоя
 */
const setTransformer = (value) => {
  get(transformer)
    .getNode()
    .nodes([get(stage).getStage().findOne(`#${value}`)].filter(Boolean));
};
watch(curId, async (value) => {
  await nextTick();
  setTransformer(value);
});
const { trigger } = watchTriggerable(template, (value) => {
  if (get(curId) === value[0].id) setTransformer(value[0].id);
  else set(curId, value[0].id);
  set(
    template,
    value.map((element) => normLayer(element))
  );
});
const curVisible = computed(() => get(template, get(curIndex)).params.visible);
onMounted(() => {
  if (isDefined(template)) trigger();
  watch(curVisible, async () => {
    await nextTick();
    setTransformer(get(curId));
  });
});
</script>
<style scoped>
:deep(.v-window__container) {
  flex: 1 1 auto !important;
  width: 100%;
}
.solid-lines {
  background-image: linear-gradient(to right, white 8px, transparent 1px),
    linear-gradient(
      rgba(var(--v-border-color), var(--v-border-opacity)) 8px,
      transparent 1px
    );
  background-repeat: repeat;
  background-position: center -4px;
}
</style>
