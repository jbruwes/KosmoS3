<template lang="pug">
slot(
  :title="typeof title === 'string' ? title : title ? getTitle(theItem) : undefined",
  :date="typeof date === 'string' ? date : date && !isNaN(new Date(theItem.date || theItem.lastmod)) ? new Date(theItem.date || theItem.lastmod).toLocaleDateString() : undefined",
  :description="typeof description === 'string' ? description : description ? theItem.description : undefined",
  :icon="typeof icon === 'string' ? `mdi-${icon}` : icon ? `mdi-${theItem.icon || 'open-in-new'}` : undefined",
  :image="typeof image === 'string' ? image : image ? theItem.image : undefined",
  :href="typeof href === 'string' ? href : href ? url : undefined"
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
    ? getItems(
        props.deep,
        props.length,
        props.reveal,
        props.sort,
        props.path,
        props.children,
        props.selector,
        props.axe
      )[0] || {}
    : {};
});
const url = computed(() => {
  const href = getHref(get(theItem));
  return href === get(routePath) ? "" : href;
});
</script>
