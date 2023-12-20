<template lang="pug">
.carousel-item.min-h-screen.w-full.flex-auto.items-center(
  v-for="object in selectedObject.siblings",
  :id="object.id",
  :key="object.id",
  ref="itemRefs"
)
  .prose.mx-auto.flex-auto(:class="{ container: object.responsive }")
    v-runtime-template(:template="object.html || '&nbsp;'")
</template>
<script setup>
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";

import data from "../stores/data";

const { selectedObject, selected } = storeToRefs(data());
const itemRefs = ref([]);
onMounted(() => {
  const el =
    get(itemRefs).find(({ id }) => id === get(selected)) ?? get(itemRefs, 0);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
});
</script>
