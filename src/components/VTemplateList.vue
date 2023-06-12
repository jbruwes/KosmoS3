<template lang="pug">
v-form(ref="form")
  v-list
    draggable(v-model="template", item-key="id")
      template(#item="{ element, index }")
        v-list-item.px-1.py-0(
          :value="element.id",
          :active="element.id === itemId",
          @click="clickRect(index)",
          @blur="element.params.edit = false"
        )
          template(#prepend)
            v-list-item-action
              v-checkbox-btn(v-model="element.params.visible")
              v-icon(
                v-if="!(element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1)",
                @click="delRect(index)"
              ) mdi-minus-circle-outline
              v-icon(
                v-if="element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1"
              ) mdi-checkbox-blank-circle-outline
          v-text-field(
            v-model.trim="element.name",
            :readonly="element.id !== itemId || !element.params.edit",
            :disabled="element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1",
            variant="underlined",
            :rules="[(v) => !!v || 'Field is required', (v) => !(template.filter(({ name }) => name === v).length - 1) || 'Must be unique']",
            @blur="element.params.edit = false",
          )
          template(#append)
            v-list-item-action
              v-icon(@click="addRect(index)") mdi-plus-circle-outline
              v-icon mdi-drag-vertical
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import app from "@/store/app";
import TemplateStore from "@/store/templateStore";

const store = app();
const templateStore = TemplateStore();
const { template } = storeToRefs(store);
const { calcLayer } = store;
const { itemId, itemIndex } = storeToRefs(templateStore);
const { normLayer } = templateStore;
const form = ref();
onMounted(() => {
  get(form).validate();
});
watch(
  () => get(template, get(itemIndex))?.name,
  () => {
    get(form).validate();
  }
);
/** @param {number} index индекс */
const addRect = (index) => {
  get(template).splice(index + 1, 0, normLayer(calcLayer()));
  get(form).validate();
};
/** @param {number} index индекс */
const delRect = (index) => {
  const last = get(template).length - 1;
  if (last) {
    get(template).splice(index, 1);
    set(itemId, get(template, index === last ? index - 1 : index).id);
  }
};
/** @param {number} index индекс */
const clickRect = (index) => {
  if (get(itemId) !== get(template, index).id)
    set(itemId, get(template, index).id);
  else get(template, index).params.edit = true;
};
</script>
