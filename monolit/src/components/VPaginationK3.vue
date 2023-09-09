<template lang="pug">
v-pagination(v-model="itemIndex", :length="itemsLength", :total-visible="7")
</template>
<script setup>
import { get, set, watchTriggerable } from "@vueuse/core";
import page from "page";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

import app from "@/store/app";

const props = defineProps({
  variant: { default: undefined, type: String },
  deep: { default: undefined, type: Boolean },
  length: { default: undefined, type: Number },
  reveal: { default: undefined, type: Boolean },
  sort: { default: undefined, type: String },
  path: { default: undefined, type: String },
  children: { default: undefined, type: Boolean },
  selector: { default: "*/*[@id]", type: String },
  axe: { default: "parent", type: String },
});
const store = app();
const { id } = storeToRefs(store);
const { getItems, getHref } = store;
const itemIndex = ref(0);
const items = computed(() =>
  getItems({
    deep: props.deep,
    length: props.length,
    reveal: props.reveal,
    sort: props.sort,
    path: props.path,
    children: props.children,
    selector: props.selector,
    axe: props.axe,
  }),
);
const itemsLength = computed(() => get(items).length);
const { trigger } = watchTriggerable(items, (newItems) => {
  const index = 1 + newItems.findIndex((item) => item.id === get(id));
  if (index) set(itemIndex, index);
});
watch(itemIndex, (newItemIndex, oldItemIndex) => {
  if (oldItemIndex) page(getHref(get(items, newItemIndex - 1)));
});
if (get(id)) trigger();
</script>
