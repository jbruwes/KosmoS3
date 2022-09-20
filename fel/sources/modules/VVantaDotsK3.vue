<template>
  <v-sheet ref="vantaRef"><slot></slot></v-sheet>
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import DOTS from "vanta/dist/vanta.dots.min";
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
  color: { default: 0xff8820, type: Number },
  color2: { default: 0xff8820, type: Number },
  backgroundColor: { default: 0x222222, type: Number },
  size: { default: 3, type: Number },
  spacing: { default: 35, type: Number },
  showLines: { default: true, type: Boolean },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = DOTS({
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
    color: props.color,
    color2: props.color2,
    backgroundColor: props.backgroundColor,
    size: props.size,
    spacing: props.spacing,
    showLines: props.showLines,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
