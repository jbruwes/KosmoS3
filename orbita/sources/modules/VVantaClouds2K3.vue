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
  mouseControls: { default: true, type: Boolean },
  touchControls: { default: true, type: Boolean },
  gyroControls: { default: false, type: Boolean },
  minHeight: { default: 200, type: Number },
  minWidth: { default: 200, type: Number },
  scale: { default: 1, type: Number },
  scaleMobile: { default: 4, type: Number },
  backgroundColor: { default: 0x000000, type: Number },
  skyColor: { default: 0x5ca6ca, type: Number },
  cloudColor: { default: 0x334d80, type: Number },
  lightColor: { default: 0xffffff, type: Number },
  speed: { default: 1.0, type: Number },
  texturePath: { default: "noise.png", type: String },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = CLOUDS2({
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
    skyColor: props.skyColor,
    cloudColor: props.cloudColor,
    lightColor: props.lightColor,
    speed: props.speed,
    texturePath: props.texturePath,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
