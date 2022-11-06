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
          v-model="template[curIndex].params.x",
          step="1",
          strict,
          thumb-label="always"
        )
        v-range-slider.mt-8(
          v-model="template[curIndex].params.y",
          step="1",
          strict,
          thumb-label="always"
        )
        v-slider.mt-8(
          v-model="template[curIndex].rotation",
          step="1",
          min="-180",
          max="180",
          thumb-label="always"
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
                @transform="update",
                @drag="update"
              )
              v-transformer(
                ref="transformer",
                :config="{ flipEnabled: false }"
              )
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
const el = ref();
const form = ref();
const transformer = ref();
const stage = ref();
const { width, height } = useElementSize(el);
const curId = ref();
const curIndex = computed(() =>
  get(template).findIndex(({ id }) => id === get(curId))
);
/**
 *
 * @param {object} e событие
 */
const update = (e) => {
  const shape = get(template).find(({ id }) => id === e.target.id());
  shape.x = e.target.x();
  shape.y = e.target.y();
  shape.rotation = e.target.rotation();
  shape.scaleX = e.target.scaleX();
  shape.scaleY = e.target.scaleY();
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
    if (value.length && !(oldValue || []).length) set(curId, value[0].id);
    else get(form).validate();
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
  get(template).splice(index + 1, 0, calcLayer());
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
