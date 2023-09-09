<template lang="pug">
v-carousel(cycle, show-arrows="hover", :height="height", :width="width")
  v-carousel-item(v-for="(item, i) in items", :key="i", ripple)
    slot(:item="item", :date="date", :description="description")
</template>
<script setup>
import { computed } from "vue";

import app from "@/store/app";

const props = defineProps({
  date: { default: false, type: [Boolean, String] },
  description: { default: true, type: [Boolean, String] },
  deep: { default: undefined, type: Boolean },
  length: { default: undefined, type: Number },
  reveal: { default: undefined, type: Boolean },
  sort: { default: undefined, type: String },
  path: { default: undefined, type: String },
  children: { default: undefined, type: Boolean },
  selector: { default: undefined, type: String },
  axe: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
});
const store = app();
const { getItems } = store;
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
</script>
