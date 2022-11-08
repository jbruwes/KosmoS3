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
        v-form(ref="form")
          v-list
            draggable(v-model="template", item-key="id")
              template(#item="{ element, index }")
                v-list-item.px-1.py-0(
                  :value="element.id",
                  :active="element.id === curId",
                  @click="clickRect(index)",
                  @blur="element.edit = false"
                )
                  template(#prepend)
                    v-list-item-action
                      v-checkbox-btn
                      v-icon(
                        v-if="!(element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1)",
                        @click="delRect(index)"
                      ) mdi-minus-circle-outline
                      v-icon(
                        v-if="element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1"
                      ) mdi-checkbox-blank-circle-outline
                  v-text-field(
                    v-model.trim="element.name",
                    :readonly="element.id !== curId || !element.edit",
                    :disabled="element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1",
                    variant="underlined",
                    :rules="[(v) => !!v || 'Field is required', (v) => !(template.filter(({ name }) => name === v).length - 1) || 'Must be unique']",
                    @blur="element.edit = false"
                  )
                  template(#append)
                    v-list-item-action
                      v-icon(@click="addRect(index)") mdi-plus-circle-outline
                      v-icon mdi-drag-vertical
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
              value="static",
              prepend-icon="mdi-format-wrap-top-bottom",
              stacked,
              size="small"
            ) static
            v-btn.flex-grow-1(
              value="absolute",
              prepend-icon="mdi-format-wrap-square",
              stacked,
              size="small"
            ) absolute
            v-btn.flex-grow-1(
              value="fixed",
              prepend-icon="mdi-format-wrap-tight",
              stacked,
              size="small"
            ) fixed
        v-switch(
          v-model="template[curIndex].params.type",
          :label="`Type: ${template[curIndex].params.type}`",
          inset,
          :hide-details="true",
          true-value="responsive",
          false-value="fluid"
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
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-ungroup") Layout
    v-tab(value="2", prepend-icon="mdi-eye") Visual
    v-tab(value="3", prepend-icon="mdi-code-tags") Source
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1", :eager="true")
      v-container.h-100.pa-0(ref="fluid", fluid)
        v-container.h-100.pa-0.bg-grey-lighten-5(ref="responsive")
        v-overlay(
          :model-value="true",
          :scrim="false",
          z-index="0",
          contained,
          persistent,
          no-click-animation
        )
          v-stage(
            ref="stage",
            :config="{ width, height }",
            @mousedown="handleStageMouseDown",
            @touchstart="handleStageMouseDown"
          )
            v-layer(ref="layer")
              v-rect(
                v-for="item in reverseTemplate",
                :key="item.id",
                :config="item",
                @transform="update",
                @dragmove="update"
              )
              v-transformer(ref="transformer", :config="configTransform")
    v-window-item.h-100(value="2")
      v-wysiwyg(v-model="template[curIndex].params.value")
    v-window-item.h-100(value="3")
      v-source-code(v-model="template[curIndex].params.value")
</template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useDisplay } from "vuetify";
import { get, set, useElementSize, watchTriggerable } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import kosmos3 from "@/kosmos3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, template } = storeToRefs(store);
const { calcLayer } = store;
const { mobile } = useDisplay();
set(panel, !get(mobile));
const reverseTemplate = computed(() => [...get(template)].reverse());
const tab = ref(1);
const drawer = ref(1);
const fluid = ref();
const form = ref();
const transformer = ref();
const stage = ref();
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
const { width, height } = useElementSize(fluid);
const configTransform = {
  flipEnabled: false,
  rotateEnabled: false,
  /**
   * проверка невыхода за габариты при изменении размеров
   *
   * @param {object} oldBox старые размеры
   * @param {object} newBox новые размеры
   * @returns {object} разрешенные размеры
   */
  boundBoxFunc: (oldBox, newBox) =>
    Math.round(newBox.x) < 0 ||
    Math.round(newBox.y) < 0 ||
    Math.round(newBox.x + newBox.width) > Math.round(get(width)) ||
    Math.round(newBox.y + newBox.height) > Math.round(get(height))
      ? oldBox
      : newBox,
};
const curId = ref();
const curIndex = computed(() =>
  get(template).findIndex(({ id }) => id === get(curId))
);
/**
 *
 * @param {object} e событие
 */
const handleStageMouseDown = (e) => {
  const targetId = e.target.id();
  if (get(template).find(({ id }) => id === targetId)) set(curId, targetId);
};
watch(curId, (value) => {
  setTimeout(() => {
    get(transformer)
      .getNode()
      .nodes([get(stage).getStage().findOne(`#${value}`)]);
  });
});
/**
 *
 * @param {object} value слой
 * @returns {object} нормализованный слой
 */
const normLayer = (value) => ({
  ...value,
  /** @returns {number} отступ слева */
  get x() {
    return (
      (this.params.width[0] * get(width)) / 100 +
      (this.width - this.offsetX) * this.scaleX
    );
  },
  /** @param {number} val отступ слева */
  set x(val) {
    this.params.width[0] = (100 * val) / get(width);
  },
  /** @returns {number} отступ сверху */
  get y() {
    return (
      (this.params.height[0] * get(height)) / 100 +
      (this.height - this.offsetY) * this.scaleY
    );
  },
  /** @param {number} val отступ сверху */
  set y(val) {
    this.params.height[0] = (100 * val) / get(height);
  },

  /** @returns {number} масштаб по х */
  get scaleX() {
    return ((this.params.width[1] - this.params.width[0]) * get(width)) / 100;
  },
  /** @param {number} val масштаб по х */
  set scaleX(val) {
    this.params.width[1] = this.params.width[0] + (100 * val) / get(width);
  },

  /** @returns {number} масштаб по y */
  get scaleY() {
    return (
      ((this.params.height[1] - this.params.height[0]) * get(height)) / 100
    );
  },
  /** @param {number} val масштаб по y */
  set scaleY(val) {
    this.params.height[1] = this.params.height[0] + (100 * val) / get(height);
  },
  /**
   * проверка невыхода за габариты при изменении положения
   *
   * @param {object} pos новые координаты
   * @returns {object} разрешенные координаты
   */
  dragBoundFunc(pos) {
    const { x: posX, y: posY } = pos;
    const offsetX = (this.attrs.width - this.attrs.offsetX) * this.attrs.scaleX;
    const offsetY =
      (this.attrs.height - this.attrs.offsetY) * this.attrs.scaleY;
    const lX = Math.round(posX - offsetX);
    const lY = Math.round(posY - offsetY);
    const right = get(width) - this.attrs.scaleX;
    const bottom = get(height) - this.attrs.scaleY;
    let x = posX;
    if (lX < 0) x = offsetX;
    if (lX > Math.round(right)) x = right + offsetX;
    let y = posY;
    if (lY < 0) y = offsetY;
    if (lY > Math.round(bottom)) y = bottom + offsetY;
    return { x, y };
  },
});
const { trigger } = watchTriggerable(
  template,
  (value, oldValue) => {
    if (value.length && !(oldValue || []).length) {
      set(curId, value[0].id);
      set(
        template,
        value.map((element) => normLayer(element))
      );
    } else get(form).validate();
  },
  { deep: true }
);
onMounted(() => {
  setTimeout(() => {
    trigger();
  });
});
/** @param {number} index индекс */
const addRect = (index) => {
  get(template).splice(index + 1, 0, normLayer(calcLayer()));
};
/** @param {number} index индекс */
const delRect = (index) => {
  const last = get(template).length - 1;
  if (last) {
    get(template).splice(index, 1);
    set(curId, get(template)[index === last ? index - 1 : index].id);
  }
};
/** @param {number} index индекс */
const clickRect = (index) => {
  const element = get(template)[index];
  if (get(curId) !== element.id) set(curId, element.id);
  else element.edit = true;
};
</script>
