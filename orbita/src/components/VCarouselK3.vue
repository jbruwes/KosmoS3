<template lang="pug">
v-carousel(cycle, show-arrows="hover", :height="height", :width="width")
  v-carousel-item(v-for="(item, i) in items", :key="i", :ripple="true")
    slot(:item="item", :date="date", :description="description")
</template>
<script setup>
import { computed } from "vue";
import orbita from "@/orbita";

const props = defineProps({
  date: { default: false, type: [Boolean, String] },
  description: { default: true, type: [Boolean, String] },
  deep: { default: undefined, type: Boolean },
  length: { default: undefined, type: Number },
  reveal: { default: undefined, type: Boolean },
  sort: { default: undefined, type: String },
  path: { default: undefined, type: String },
  children: { default: undefined, type: Boolean },
  selector: { default: "*[@id]", type: String },
  axe: { default: undefined, type: String },
});
const store = orbita();
const { getItems } = store;
const items = computed(() =>
  getItems(
    props.deep,
    props.length,
    props.reveal,
    props.sort,
    props.path,
    props.children,
    props.selector,
    props.axe
  )
);
</script>
