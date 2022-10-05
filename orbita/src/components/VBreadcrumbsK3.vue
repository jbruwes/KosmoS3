<template>
  <v-breadcrumbs :items="items"></v-breadcrumbs>
</template>
<script setup>
import { computed } from "vue";
import sputnik from "@/sputnik";

const props = defineProps({
  variant: { default: undefined, type: String },
  deep: { default: undefined, type: Boolean },
  length: { default: undefined, type: Number },
  reveal: { default: undefined, type: Boolean },
  sort: { default: undefined, type: String },
  path: { default: undefined, type: String },
  children: { default: undefined, type: Boolean },
  selector: { default: "*[@id]", type: String },
  axe: { default: "ancestor-or-self", type: String },
  disabled: { default: true, type: Boolean },
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
    disabled: (index === array.length - 1 && props.disabled) || !item.visible,
  }))
);
</script>
