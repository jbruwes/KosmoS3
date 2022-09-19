<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import HALO from "vanta/dist/vanta.halo.min";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { get, useResizeObserver } from "@vueuse/core";
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = HALO({
    el: get(vantaRef).$el,
    THREE: THREE,
    p5: p5,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
