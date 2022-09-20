<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import HALO from "vanta/dist/vanta.halo.min";
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
  baseColor: { default: 0x001a59, type: Number },
  color2: { default: 0xf2e735, type: Number },
  backgroundColor: { default: 0x131a43, type: Number },
  amplitudeFactor: { default: 1.0, type: Number },
  ringFactor: { default: 1.0, type: Number },
  rotationFactor: { default: 1.0, type: Number },
  xOffset: { default: 0, type: Number },
  yOffset: { default: 0, type: Number },
  size: { default: 1.0, type: Number },
  speed: { default: 1.0, type: Number },
  mouseEase: { default: true, type: Boolean },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = HALO({
    el: get(vantaRef).$el,
    THREE: THREE,
    p5: p5,
    mouseControls: props.mouseControls,
    touchControls: props.touchControls,
    gyroControls: props.gyroControls,
    minHeight: props.minHeight,
    minWidth: props.minWidth,
    scale: props.scale,
    scaleMobile: props.scaleMobile,
    baseColor: props.baseColor,
    color2: props.color2,
    backgroundColor: props.backgroundColor,
    amplitudeFactor: props.amplitudeFactor,
    ringFactor: props.ringFactor,
    rotationFactor: props.rotationFactor,
    xOffset: props.xOffset,
    yOffset: props.yOffset,
    size: props.size,
    speed: props.speed,
    mouseEase: props.mouseEase,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
