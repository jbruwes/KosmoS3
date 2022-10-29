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
      v-container.h-100(fluid)
        v-list
          draggable(v-model="template", item-key="id")
            template(#item="{ element, index }")
              v-list-item(
                :value="element.id",
                :active="element.id === id",
                @click="id = element.id"
              )
                template(#prepend)
                  v-list-item-action
                    v-icon mdi-lock-outline
                    v-checkbox-btn
                    v-icon mdi-minus-circle-outline
                v-text-field(
                  v-model="element.name",
                  variant="underlined",
                  @click:prepend-inner="template.length - 1 && template.splice(index, 1)",
                  @click:append-inner="template.splice(index + 1, 0, { name: '', id: uuid() })"
                )
                template(#append)
                  v-list-item-action
                    v-icon mdi-plus-circle-outline
                    v-icon mdi-drag-vertical
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
                v-for="item in [...template].reverse()",
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
import { ref, watch, onMounted } from "vue";
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
const tab = ref(1);
const drawer = ref(1);
const el = ref();
const transformer = ref();
const stage = ref();
const { width, height } = useElementSize(el);
const id = ref();
/**
 *
 * @param {object} e событие
 */
const rect = (e) => {
  const name = e.target.name();
  const lRect = get(template).find((r) => r.name === name);
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
  const lId = e.target.id();
  if (get(template).find((r) => r.id === lId)) set(id, lId);
};
watch(id, (value) => {
  get(transformer)
    .getNode()
    .nodes([get(stage).getStage().findOne(`#${value}`)]);
});
const { trigger } = watchTriggerable(template, (value, oldValue) => {
  if (value && !oldValue) set(id, get(value, 0).id);
});
onMounted(() => {
  setTimeout(() => {
    trigger();
  });
});
/** @returns {string} uuid */
const uuid = () => crypto.randomUUID();
</script>
