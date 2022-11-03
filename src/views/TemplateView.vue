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
                        v-if="element.name !== 'content' && template.length > 1",
                        @click="delRect(index)"
                      ) mdi-minus-circle-outline
                      v-icon(
                        v-if="element.name === 'content' || template.length === 1"
                      ) mdi-checkbox-blank-circle-outline
                  v-text-field(
                    v-model.trim="element.name",
                    :readonly="element.id !== curId || !element.edit",
                    :disabled="element.name === 'content'",
                    variant="underlined",
                    :rules="[(v) => !!v || 'Field is required', (v) => !(template.filter((element) => element.name === v).length - 1) || 'Must be unique']",
                    @blur="element.edit = false"
                  )
                  template(#append)
                    v-list-item-action
                      v-icon(@click="addRect(index)") mdi-plus-circle-outline
                      v-icon mdi-drag-vertical
    v-window-item(value="2")
      v-container.h-100(v-if="~curIndex", fluid)
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
        v-text-field(
          v-model.number="template[curIndex].params.width",
          label="width",
          variant="underlined",
          prepend-icon="mdi-lock",
          clearable,
          type="number"
        )
          template(#append)
            v-icon(icon="mdi-success")
        v-text-field(
          v-model.number="template[curIndex].params.height",
          label="height",
          variant="underlined",
          prepend-icon="mdi-lock",
          clearable,
          type="number"
        )
        v-text-field(
          v-model.number="template[curIndex].params.top",
          label="top",
          variant="underlined",
          prepend-icon="mdi-lock",
          clearable,
          type="number"
        )
        v-text-field(
          v-model.number="template[curIndex].params.bottom",
          label="bottom",
          variant="underlined",
          prepend-icon="mdi-lock",
          clearable,
          type="number"
        )
        v-text-field(
          v-model.number="template[curIndex].params.left",
          label="left",
          variant="underlined",
          prepend-icon="mdi-lock",
          clearable,
          type="number"
        )
        v-text-field(
          v-model.number="template[curIndex].params.right",
          label="right",
          variant="underlined",
          prepend-icon="mdi-lock",
          clearable,
          type="number"
        )
        v-text-field(
          v-model.number="template[curIndex].params.rotation",
          label="rotation",
          variant="underlined",
          clearable,
          type="number"
        )
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-ungroup") Layout
    v-tab(value="2", prepend-icon="mdi-eye") Visual
    v-tab(value="3", prepend-icon="mdi-code-tags") Source
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1", :eager="true")
      .h-100(ref="el")
        iframe.h-100.w-100.border-0
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
                @transformend="rect",
                @dragend="rect"
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
import { ref, watch, onMounted, computed } from "vue";
import { useDisplay } from "vuetify";
import {
  get,
  set,
  useElementSize,
  watchTriggerable,
  isDefined,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import Konva from "konva";
import draggable from "vuedraggable";
import kosmos3 from "@/kosmos3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, template } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const reverseTemplate = computed(() =>
  Array.isArray(get(template)) ? [...get(template)].reverse() : get(template)
);
const tab = ref(1);
const drawer = ref(1);
const el = ref();
const form = ref();
const transformer = ref();
const stage = ref();
const { width, height } = useElementSize(el);
const curId = ref();
const curIndex = computed(() =>
  isDefined(template)
    ? get(template).findIndex((element) => element.id === get(curId))
    : -1
);
/**
 *
 * @param {object} e событие
 */
const rect = (e) => {
  const shape = get(template).find((r) => r.id === e.target.id());
  e.target.width(Math.round(e.target.width() * e.target.scaleX()));
  e.target.height(Math.round(e.target.height() * e.target.scaleY()));
  e.target.scaleX(1);
  e.target.scaleY(1);
  e.target.rotation(Math.round(e.target.rotation()));
  shape.x = e.target.x();
  shape.y = e.target.y();
  shape.rotation = e.target.rotation();
  shape.width = e.target.width();
  shape.height = e.target.height();
};
/**
 *
 * @param {object} e событие
 */
const handleStageMouseDown = (e) => {
  const id = e.target.id();
  if (get(template).find((r) => r.id === id)) set(curId, id);
};
watch(curId, (value) => {
  setTimeout(() => {
    const node = get(stage).getStage().findOne(`#${value}`);
    if (node) get(transformer).getNode().nodes([node]);
  });
});
const { trigger } = watchTriggerable(
  template,
  (value, oldValue) => {
    if (value && !oldValue) set(curId, get(value, 0).id);
    get(form).validate();
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
  const shape = {
    id: crypto.randomUUID(),
    rotation: 0,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: Konva.Util.getRandomColor(),
    opacity: 0.1,
    name: "",
    draggable: true,
    /** @returns {number} сдвиг по x */
    get offsetX() {
      return this.width / 2;
    },
    /** @returns {number} сдвиг по y */
    get offsetY() {
      return this.height / 2;
    },
    params: {
      position: "static",
      type: "fluid",
      /** @returns {number} сдвиг по x */
      get rotation() {
        return shape.rotation || 0;
      },
      /** @param {number} pValue угол поворота */
      set rotation(pValue) {
        shape.rotation = pValue || 0;
      },
    },
  };
  get(template).splice(index + 1, 0, shape);
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
