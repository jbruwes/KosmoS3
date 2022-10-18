<template lang="pug">
v-container
  v-row(justify="center")
    v-col(
      v-for="(item, i) in items",
      :key="i",
      cols="12",
      sm="6",
      md="4",
      lg="3"
    )
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
