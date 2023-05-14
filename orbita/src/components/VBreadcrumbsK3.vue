<template lang="pug">
v-breadcrumbs(:items="items")
</template>
<script setup>
import { computed } from "vue";
import orbita from "@/orbita";

const props = defineProps({
  variant: { default: undefined, type: String },
  deep: { default: undefined, type: Boolean },
  length: { default: undefined, type: Number },
  reveal: { default: undefined, type: Boolean },
  sort: { default: undefined, type: String },
  path: { default: undefined, type: String },
  children: { default: undefined, type: Boolean },
  selector: { default: undefined, type: String },
  axe: { default: "ancestor-or-self", type: String },
  disabled: { default: true, type: Boolean },
});
const store = orbita();
const { getItems, getTitle, getHref } = store;
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
  }).map((item, index, array) => ({
    title: getTitle(item),
    href: getHref(item),
    disabled:
      (index === array.length - 1 && props.disabled) ||
      (!item.visible && !props.reveal),
  }))
);
</script>
