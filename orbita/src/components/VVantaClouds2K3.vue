<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import CLOUDS2 from "vanta/dist/vanta.clouds2.min";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { get, useResizeObserver } from "@vueuse/core";

const props = defineProps({
  options: {
    /**
     * @returns {object} default options
     */
    default: () => ({}),
    type: Object,
  },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = CLOUDS2({
    el: get(vantaRef).$el,
    THREE,
    p5,
    ...props.options,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
