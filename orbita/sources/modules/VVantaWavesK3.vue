<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import WAVES from "vanta/dist/vanta.waves.min";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { get, useResizeObserver } from "@vueuse/core";

const props = defineProps({
  mouseControls: { default: true, type: Boolean },
  touchControls: { default: true, type: Boolean },
  gyroControls: { default: false, type: Boolean },
  minHeight: { default: 200, type: Number },
  minWidth: { default: 200, type: Number },
  scale: { default: 1, type: Number },
  scaleMobile: { default: 1, type: Number },
  color: { default: 0x005588, type: Number },
  shininess: { default: 30, type: Number },
  waveHeight: { default: 15, type: Number },
  waveSpeed: { default: 1, type: Number },
  zoom: { default: 1, type: Number },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = WAVES({
    el: get(vantaRef).$el,
    THREE,
    p5,
    mouseControls: props.mouseControls,
    touchControls: props.touchControls,
    gyroControls: props.gyroControls,
    minHeight: props.minHeight,
    minWidth: props.minWidth,
    scale: props.scale,
    scaleMobile: props.scaleMobile,
    color: props.color,
    shininess: props.shininess,
    waveHeight: props.waveHeight,
    waveSpeed: props.waveSpeed,
    zoom: props.zoom,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
