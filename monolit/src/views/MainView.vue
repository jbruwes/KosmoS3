<template lang="pug">
.carousel-item.min-h-screen.w-full.flex-auto.items-center(
  v-for="object in selectedObject.siblings",
  :id="object.id",
  :key="object.id",
  ref="itemRefs"
)
  .prose.mx-auto.flex-auto(:class="{ container: object.responsive }")
    v-runtime-template(:template="object.html")
</template>
<script setup>
import { get, useArrayFind } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";

import data from "../stores/data";

const { selectedObject, selected } = storeToRefs(data());
const itemRefs = ref([]);
const firstElementId = computed(() => {
  const { siblings } = get(selectedObject);
  const [{ id }] = siblings;
  return id;
});
const scrollToElementFirst = useArrayFind(
  itemRefs,
  ({ id }) => id === get(firstElementId),
);
const scrollToElementCurrent = useArrayFind(
  itemRefs,
  ({ id }) => id === get(selected),
);
const scrollToElement = computed(
  () => get(scrollToElementCurrent) ?? get(scrollToElementFirst),
);
watch(scrollToElement, (value) => {
  setTimeout(() => {
    value?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });
});
</script>
