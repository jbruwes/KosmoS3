<template lang="pug">
slot(
  :title="title",
  :date="date",
  :description="description",
  :icon="icon",
  :image="image",
  :href="href",
  :item="theItem"
)
</template>
<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { get } from "@vueuse/core";
import orbita from "@/orbita";

const props = defineProps({
  title: { default: true, type: [Boolean, String] },
  icon: { default: true, type: [Boolean, String] },
  image: { default: true, type: [Boolean, String] },
  href: { default: true, type: [Boolean, String] },
  item: { default: true, type: [Boolean, Object] },
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
});
const store = orbita();
const { routePath } = storeToRefs(store);
const { getTitle, getHref, getItems } = store;
const theItem = computed(() => {
  if (typeof props.item === "object") return props.item;
  return props.item
    ? getItems({
        deep: props.deep,
        length: props.length,
        reveal: props.reveal,
        sort: props.sort,
        path: props.path,
        children: props.children,
        selector: props.selector,
        axe: props.axe,
      })[0] || {}
    : {};
});
const url = computed(() => {
  const href = getHref(get(theItem));
  return href === get(routePath) ? "" : href;
});
const title = computed(() => {
  if (typeof props.title === "string") return props.title;
  return props.title ? getTitle(get(theItem)) : undefined;
});
const date = computed(() => {
  if (typeof props.date === "string") return props.date;
  return props.date &&
    !Number.isNaN(new Date(get(theItem).date || get(theItem).lastmod))
    ? new Date(get(theItem).date || get(theItem).lastmod).toLocaleDateString()
    : undefined;
});
const description = computed(() => {
  if (typeof props.description === "string") return props.description;
  return props.description ? get(theItem).description : undefined;
});
const icon = computed(() => {
  if (typeof props.icon === "string") return `mdi-${props.icon}`;
  return props.icon ? `mdi-${get(theItem).icon || "open-in-new"}` : undefined;
});
const image = computed(() => {
  if (typeof props.image === "string") return props.image;
  return props.image ? get(theItem).image : undefined;
});
const href = computed(() => {
  if (typeof props.href === "string") return props.href;
  return props.href ? get(url) : undefined;
});
</script>
