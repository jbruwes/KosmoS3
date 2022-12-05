<template lang="pug">
v-form(ref="form")
  v-list
    draggable(v-model="template", item-key="id")
      template(#item="{ element, index }")
        v-list-item.px-1.py-0(
          :value="element.id",
          :active="element.id === id",
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
            :readonly="element.id !== id || !element.edit",
            :disabled="element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1",
            cur-prefix="#",
            variant="underlined",
            :rules="[(v) => !!v || 'Field is required', (v) => !(template.filter(({ name }) => name === v).length - 1) || 'Must be unique']",
            @blur="element.edit = false"
          )
          template(#append)
            v-list-item-action
              v-icon(@click="addRect(index)") mdi-plus-circle-outline
              v-icon mdi-drag-vertical
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import kosmos3 from "@/stores/kosmos3";
import template3 from "@/stores/template3";

const store = kosmos3();
const localStore = template3();
const { template } = storeToRefs(store);
const { calcLayer } = store;
const { id } = storeToRefs(localStore);
const form = ref();
watch(
  template,
  () => {
    get(form).validate();
  },
  { deep: true }
);
onMounted(async () => {
  await nextTick();
  get(form).validate();
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
    const { id: lId } = get(template, index === last ? index - 1 : index);
    set(id, lId);
  }
};
/** @param {number} index индекс */
const clickRect = (index) => {
  const element = get(template)[index];
  const { id: lId } = element;
  if (get(id) !== lId) set(id, lId);
  else element.edit = true;
};
</script>
