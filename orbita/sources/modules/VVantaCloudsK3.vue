<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import CLOUDS from "vanta/dist/vanta.clouds.min";
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
  backgroundColor: { default: 0xffffff, type: Number },
  skyColor: { default: 0x68b8d7, type: Number },
  cloudColor: { default: 0xadc1de, type: Number },
  cloudShadowColor: { default: 0x183550, type: Number },
  sunColor: { default: 0xff9919, type: Number },
  sunGlareColor: { default: 0xff6633, type: Number },
  sunlightColor: { default: 0xff9933, type: Number },
  speed: { default: 1, type: Number },
  mouseEase: { default: true, type: Boolean },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = CLOUDS({
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
    cloudShadowColor: props.cloudShadowColor,
    sunColor: props.sunColor,
    sunGlareColor: props.sunGlareColor,
    sunlightColor: props.sunlightColor,
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
