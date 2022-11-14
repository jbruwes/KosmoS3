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
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-ungroup") Layout
    v-tab(value="2", prepend-icon="mdi-eye") Visual
    v-tab(value="3", prepend-icon="mdi-code-tags") Source
  v-window.h-100(v-model="tab")
    v-window-item.h-100.overflow-y-auto(ref="fluidContainer", value="1")
      .position-relative
        v-overlay(
          :model-value="true",
          :scrim="false",
          z-index="0",
          contained,
          persistent,
          no-click-animation,
          content-class="w-100 h-100"
        )
          v-container.h-100.pa-0.bg-grey-lighten-5(ref="responsiveContainer")
        v-stage(
          ref="stage",
          :config="{ width: fullWidth, height: fullHeight }",
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
const fluidContainer = ref();
const responsiveContainer = ref();
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
const curId = ref();
const curIndex = computed(() =>
  get(template).findIndex(({ id }) => id === get(curId))
);
const { width: fullWidth, height } = useElementSize(fluidContainer);
const { width: responsiveWidth } = useElementSize(responsiveContainer);
const fullHeight = computed(
  () =>
    (get(template).filter(
      ({ params: { position } = {} } = {}) => position === "static"
    ).length || 1) * get(height)
);
/**
 *
 * @param {boolean} responsive адаптивность
 * @returns {number} ширина контейнера
 */
const containerWidth = (responsive) =>
  responsive ? get(responsiveWidth) : get(fullWidth);
/**
 *
 * @param {boolean} responsive адаптивность
 * @returns {number} адаптивный сдвиг по горизонтали
 */
const offsetX = (responsive) =>
  (responsive > 0) * ((get(fullWidth) - get(responsiveWidth)) / 2);

/**
 * @param {number} value ширина px
 * @param {boolean} responsive адаптивность
 * @returns {number} ширина %
 */
const calcXPct = (value, responsive) =>
  (100 * (value - offsetX(responsive))) / containerWidth(responsive);
/**
 * @param {number} value высота px
 * @returns {number} высота %
 */
const calcYPct = (value) => (100 * value) / get(height);
/**
 * @param {number} value ширина %
 * @param {boolean} responsive адаптивность
 * @returns {number} ширина px
 */
const calcXPx = (value, responsive) =>
  offsetX(responsive) + (value * containerWidth(responsive)) / 100;
/**
 * @param {number} value высота %
 * @returns {number} высота px
 */
const calcYPx = (value) => (value * get(height)) / 100;
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
  boundBoxFunc(oldBox, newBox) {
    const [{ attrs: { params: { responsive } = {} } = {} } = {}] = get(
      transformer
    )
      .getNode()
      .nodes();
    const top = calcYPct(newBox.y);
    const bottom = top + calcYPct(newBox.height);
    const left = calcXPct(newBox.x, responsive);
    const right = left + calcXPct(newBox.width, -responsive);
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
 * @param {object} value слой
 * @returns {object} нормализованный слой
 */
const normLayer = (value) => {
  const layer = {
    ...value,
    params: {
      ...value.params,
      /** @returns {number} сдвиг x */
      get offsetX() {
        return (layer.width - layer.offsetX) * layer.scaleX;
      },
      /** @returns {number} сдвиг y */
      get offsetY() {
        return (layer.height - layer.offsetY) * layer.scaleY;
      },
    },
    /** @returns {number} отступ слева */
    get x() {
      return (
        calcXPx(layer.params.width[0], layer.params.responsive) +
        layer.params.offsetX
      );
    },
    /** @param {number} val отступ слева px */
    set x(val) {
      layer.params.width[0] = calcXPct(val, layer.params.responsive);
    },
    /** @returns {number} отступ сверху */
    get y() {
      return calcYPx(layer.params.height[0]) + layer.params.offsetY;
    },
    /** @param {number} val отступ сверху px */
    set y(val) {
      layer.params.height[0] = calcYPct(val);
    },

    /** @returns {number} масштаб по х */
    get scaleX() {
      return calcXPx(
        layer.params.width[1] - layer.params.width[0],
        -layer.params.responsive
      );
    },
    /** @param {number} val масштаб по х */
    set scaleX(val) {
      layer.params.width[1] =
        layer.params.width[0] + calcXPct(val, -layer.params.responsive);
    },

    /** @returns {number} масштаб по y */
    get scaleY() {
      return calcYPx(layer.params.height[1] - layer.params.height[0]);
    },
    /** @param {number} val масштаб по y */
    set scaleY(val) {
      layer.params.height[1] = layer.params.height[0] + calcYPct(val);
    },
    /**
     * проверка невыхода за габариты при изменении положения
     *
     * @param {object} pos новые координаты
     * @param {number} pos.x новые координаты x
     * @param {number} pos.y новые координаты y
     * @returns {object} разрешенные координаты
     */
    dragBoundFunc({ x: posX, y: posY }) {
      const top = calcYPct(posY - layer.params.offsetY);
      const bottom = top + calcYPct(layer.scaleY);
      const left = calcXPct(
        posX - layer.params.offsetX,
        layer.params.responsive
      );
      const right = left + calcXPct(layer.scaleX, -layer.params.responsive);
      let x = posX;
      if (left.toFixed(2) < 0)
        x = layer.params.offsetX + offsetX(layer.params.responsive);
      if (right.toFixed(2) > 100)
        x =
          containerWidth(layer.params.responsive) -
          layer.scaleX +
          layer.params.offsetX +
          offsetX(layer.params.responsive);
      let y = posY;
      if (top.toFixed(2) < 0) y = layer.params.offsetY;
      if (bottom.toFixed(2) > 100)
        y = get(height) - layer.scaleY + layer.params.offsetY;
      return { x, y };
    },
  };
  return layer;
};
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
