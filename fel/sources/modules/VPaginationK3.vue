<template>
  <v-pagination v-model="itemIndex" :length="itemsLength" :total-visible="7">
  </v-pagination>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref, computed, watch } from "vue";
import { get, set, watchTriggerable } from "@vueuse/core";
import page from "page";
import core from "~/core.js";
const props = defineProps({
  variant: String,
  deep: Boolean,
  length: Number,
  reveal: Boolean,
  sort: String,
  path: String,
  children: { default: undefined, type: Boolean },
  xpath: { default: "*/*[@id]", type: String },
  axe: { default: "parent", type: String },
});
const store = core();
const { id } = storeToRefs(store);
const { getItems, getHref } = store;
const itemIndex = ref(0);
const items = computed(() =>
  getItems(
    props.deep,
    props.length,
    props.reveal,
    props.sort,
    props.path,
    props.children,
    props.xpath,
    props.axe
  )
);
const itemsLength = computed(() => get(items).length);
const { trigger } = watchTriggerable(items, (newItems) => {
  const index = 1 + newItems.findIndex((item) => item.id === get(id));
  if (index) set(itemIndex, index);
});
watch(itemIndex, (newItemIndex, oldItemIndex) => {
  if (oldItemIndex) page(getHref(get(items)[newItemIndex - 1]));
});
if (get(id)) trigger();
</script>
