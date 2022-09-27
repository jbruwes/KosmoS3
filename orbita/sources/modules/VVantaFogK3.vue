<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import FOG from "vanta/dist/vanta.fog.min";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { get, useResizeObserver } from "@vueuse/core";

const props = defineProps({
  mouseControls: { default: true, type: Boolean },
  touchControls: { default: true, type: Boolean },
  gyroControls: { default: false, type: Boolean },
  minHeight: { default: 200, type: Number },
  minWidth: { default: 200, type: Number },
  scale: { default: 2, type: Number },
  scaleMobile: { default: 4, type: Number },
  highlightColor: { default: 0xffc300, type: Number },
  midtoneColor: { default: 0xff1f00, type: Number },
  lowlightColor: { default: 0x2d00ff, type: Number },
  baseColor: { default: 0xffebeb, type: Number },
  blurFactor: { default: 0.6, type: Number },
  speed: { default: 1.0, type: Number },
  zoom: { default: 1.0, type: Number },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = FOG({
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
    highlightColor: props.highlightColor,
    midtoneColor: props.midtoneColor,
    lowlightColor: props.lowlightColor,
    baseColor: props.baseColor,
    blurFactor: props.blurFactor,
    speed: props.speed,
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
