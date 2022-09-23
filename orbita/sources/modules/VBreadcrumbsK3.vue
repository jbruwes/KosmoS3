<template>
  <v-breadcrumbs :items="items"></v-breadcrumbs>
</template>
<script setup>
import { computed } from "vue";
import page from "page";
import sputnik from "~/sputnik.js";
const props = defineProps({
  variant: String,
  deep: { default: undefined, type: Boolean },
  length: Number,
  reveal: { default: undefined, type: Boolean },
  sort: String,
  path: String,
  children: { default: undefined, type: Boolean },
  selector: { default: "*[@id]", type: String },
  axe: { default: "ancestor-or-self", type: String },
});
const store = sputnik();
const { getItems, getTitle, getHref } = store;
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
  ).map((item, index, array) => ({
    title: getTitle(item),
    href: getHref(item),
    disabled: index === array.length - 1 ? true : !item.visible,
  }))
);
</script>
