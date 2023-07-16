<template lang="pug">
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
</template>
<script setup>
import { ref, watch, computed, nextTick, onMounted } from "vue";
import {
  get,
  set,
  useElementSize,
  syncRefs,
  until,
  isDefined,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import app from "@/store/app";
import TemplateStore from "@/store/templateStore";

const store = app();
const { template } = storeToRefs(store);
const templateStore = TemplateStore();
const {
  itemId: curId,
  itemIndex: curIndex,
  konvaWidth,
  visibleTemplate,
  cntStatic,
  fullHeight,
  realResponsiveWidth,
} = storeToRefs(templateStore);
const { calcXPct, calcYPct, normLayer } = templateStore;
const transformer = ref();
const responsiveContainer = ref();
const stage = ref();
const { width: responsiveContainerWidth } = useElementSize(responsiveContainer);
syncRefs(responsiveContainerWidth, realResponsiveWidth);
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
const update = (e) => {
  const item = get(template).find(({ id }) => id === e.target.id());
  const { x, y, width, height } = e.target.getClientRect();
  item.x = x;
  item.y = y;
  item.scaleX = width;
  item.scaleY = height;
};
/**
 * реверсируем слои в шаблоне
 * @param { Array } value - массив слоев
 * @returns {Array} - реверсивный массив слоев
 */
const reverse = (value) => [...(value ?? [])].reverse();
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
const setTransformer = async (value) => {
  await nextTick();
  get(transformer)
    .getNode()
    .nodes([get(stage).getStage().findOne(`#${value}`)].filter(Boolean));
};
watch(curId, (value) => {
  setTransformer(value);
});
const curVisible = computed(() => get(template, get(curIndex)).params.visible);
onMounted(async () => {
  if (!isDefined(template)) await until(template).toBeTruthy();
  if (get(curId) === get(template, 0).id) setTransformer(get(template, 0).id);
  else set(curId, get(template, 0).id);
  set(
    template,
    get(template).map((element) => normLayer(element)),
  );
  watch(curVisible, () => {
    setTransformer(get(curId));
  });
});
</script>
<style scoped>
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
