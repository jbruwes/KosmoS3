<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import NET from "vanta/dist/vanta.net.min";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { get, useResizeObserver } from "@vueuse/core";
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = NET({
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
