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
    v-window-item(value="1")
      v-container.h-100(fluid)
        v-form(ref="form")
          v-list
            draggable(v-model="template", item-key="id")
              template(#item="{ element, index }")
                v-list-item(
                  :value="element.id",
                  :active="element.id === curId",
                  @click="clickRect(index)",
                  @blur="delete element.editing"
                )
                  template(#prepend)
                    v-list-item-action
                      v-checkbox-btn
                      v-icon(
                        v-if="element.name !== 'content' && template.length > 1",
                        @click="remRect(index)"
                      ) mdi-minus-circle-outline
                      v-icon(
                        v-if="element.name === 'content' || template.length === 1"
                      ) mdi-checkbox-blank-circle-outline
                  v-text-field(
                    v-model.trim="element.name",
                    :readonly="element.id !== curId || !element.editing",
                    :disabled="element.name === 'content'",
                    variant="underlined",
                    :rules="[(v) => !!v || 'Field is required', (v) => !(template.filter((element) => element.name === v).length - 1) || 'Must be unique']",
                    @blur="delete element.editing"
                  )
                  template(#append)
                    v-list-item-action
                      v-icon(@click="addRect(index)") mdi-plus-circle-outline
                      v-icon mdi-drag-vertical
    v-window-item(value="2")
      v-container.h-100.d-flex(fluid)
        v-btn-toggle.mx-auto(
          v-model="template[curIndex].k3Position",
          mandatory
        )
          v-btn(value="static")
            v-icon mdi-format-wrap-inline
          v-btn(value="relative")
            v-icon mdi-format-wrap-square
          v-btn(value="absolute")
            v-icon mdi-format-wrap-tight
          v-btn(value="fixed")
            v-icon mdi-format-wrap-top-bottom
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
import { get, set, useElementSize, watchTriggerable } from "@vueuse/core";
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
  get(template).findIndex((element) => element.id === get(curId))
);
/**
 *
 * @param {object} e событие
 */
const rect = (e) => {
  const id = e.target.id();
  const lRect = get(template).find((r) => r.id === id);
  lRect.x = e.target.x();
  lRect.y = e.target.y();
  lRect.rotation = e.target.rotation();
  lRect.scaleX = e.target.scaleX();
  lRect.scaleY = e.target.scaleY();
  lRect.fill = Konva.Util.getRandomColor();
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
  const id = crypto.randomUUID();
  get(template).splice(index + 1, 0, {
    id,
    rotation: 0,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: "red",
    name: "",
    draggable: true,
  });
};
/** @param {number} index индекс */
const remRect = (index) => {
  if (get(template).length - 1) get(template).splice(index, 1);
};
/** @param {number} index индекс */
const clickRect = (index) => {
  const lastIndex = get(template).length - 1;
  const element = get(template)[index < lastIndex ? index : lastIndex];
  if (get(curId) !== element.id) set(curId, element.id);
  else element.editing = true;
};
</script>
