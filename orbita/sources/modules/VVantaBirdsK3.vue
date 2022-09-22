<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import BIRDS from "vanta/dist/vanta.birds.min";
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
  backgroundColor: { default: 0x07192f, type: Number },
  color1: { default: 0xff0000, type: Number },
  color2: { default: 0x00d1ff, type: Number },
  colorMode: { default: "varianceGradient", type: String },
  birdSize: { default: 1, type: Number },
  wingSpan: { default: 30, type: Number },
  speedLimit: { default: 5, type: Number },
  separation: { default: 20, type: Number },
  alignment: { default: 20, type: Number },
  cohesion: { default: 20, type: Number },
  quantity: { default: 5, type: Number },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = BIRDS({
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
    backgroundColor: props.backgroundColor,
    color1: props.color1,
    color2: props.color2,
    colorMode: props.colorMode,
    birdSize: props.birdSize,
    wingSpan: props.wingSpan,
    speedLimit: props.speedLimit,
    separation: props.separation,
    alignment: props.alignment,
    cohesion: props.cohesion,
    quantity: props.quantity,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
