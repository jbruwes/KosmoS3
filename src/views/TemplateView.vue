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
                      v-checkbox-btn(v-model="element.visible")
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
        v-switch(
          v-model="template[curIndex].fluid",
          :label="`Type: ${template[curIndex].fluid ? 'fluid' : 'responsive'}`",
          inset,
          :hide-details="true"
        )
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-ungroup") Layout
    v-tab(value="2", prepend-icon="mdi-eye") Visual
    v-tab(value="3", prepend-icon="mdi-code-tags") Source
  v-window.h-100(v-model="tab")
    v-window-item.h-100.overflow-y-auto(ref="window", value="1")
      .position-relative.solid-lines(
        :style="{ backgroundSize: `23px ${100 / (visibleTemplate.length || 1)}%` }"
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
          v-container.h-100.border-s-xl.border-e-xl.border-dashed.border-t-0.border-b-0
        v-container.bg-grey-lighten-2.border-xl(
          v-for="item in visibleTemplate",
          :key="item.id",
          :fluid="item.fluid",
          :style="{ height: `${height}px`, opacity: 0.5 }",
          :class="[item.id === curId ? 'border-opacity-1' : 'border-opacity-0']",
          @click="curId = item.id"
        ) {{ `#${item.name}` }}
    v-window-item.h-100(value="2")
      v-wysiwyg(v-model="template[curIndex].value")
    v-window-item.h-100(value="3")
      v-source-code(v-model="template[curIndex].value")
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
import {
  get,
  set,
  watchTriggerable,
  useArrayFindIndex,
  useArrayFilter,
  useElementSize,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import kosmos3 from "@/kosmos3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, template } = storeToRefs(store);
const visibleTemplate = useArrayFilter(template, (element) => element.visible);
const { calcLayer } = store;
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref(1);
const drawer = ref(1);
const form = ref();
const curId = ref();
const window = ref();
const { height } = useElementSize(window);
const curIndex = useArrayFindIndex(template, ({ id }) => id === get(curId));
const { trigger: triggerTemplate } = watchTriggerable(
  template,
  (value, oldValue) => {
    if (value.length && !(oldValue || []).length) {
      set(curId, value[0].id);
      set(template, value);
    } else get(form).validate();
  },
  { deep: true }
);
onMounted(() => {
  setTimeout(() => {
    triggerTemplate();
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
