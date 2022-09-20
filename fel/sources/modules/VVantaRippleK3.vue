<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import RIPPLE from "vanta/dist/vanta.ripple.min";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { get, useResizeObserver } from "@vueuse/core";
const props = defineProps({
  mouseControls: { default: true, type: Boolean },
  touchControls: { default: true, type: Boolean },
  gyroControls: { default: false, type: Boolean },
  minHeight: { default: 200, type: Number },
  minWidth: { default: 200, type: Number },
  scale: { default: 1, type: Number },
  scaleMobile: { default: 4, type: Number },
  color1: { default: 0x60b25, type: Number },
  color2: { default: 0xffffff, type: Number },
  backgroundColor: { default: 0xf6f6f6, type: Number },
  amplitudeFactor: { default: 1.0, type: Number },
  ringFactor: { default: 4.0, type: Number },
  rotationFactor: { default: 0.1, type: Number },
  speed: { default: 1.0, type: Number },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = RIPPLE({
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
    color1: props.color1,
    color2: props.color2,
    backgroundColor: props.backgroundColor,
    amplitudeFactor: props.amplitudeFactor,
    ringFactor: props.ringFactor,
    rotationFactor: props.rotationFactor,
    speed: props.speed,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
