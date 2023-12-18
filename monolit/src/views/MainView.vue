<template lang="pug">
.carousel-item.min-h-screen.w-full.flex-auto.items-center(
  v-for="object in selectedObject.siblings",
  :id="object.id",
  :key="object.id"
)
  .prose.mx-auto.flex-auto(:class="{ container: object.responsive }")
    v-runtime-template(:template="object.html")
</template>
<script setup>
import { storeToRefs } from "pinia";
import VRuntimeTemplate from "vue3-runtime-template";

import data from "../stores/data";

const { selectedObject } = storeToRefs(data());
</script>
