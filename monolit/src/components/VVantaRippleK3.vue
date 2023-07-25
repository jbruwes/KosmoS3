<template lang="pug">
v-sheet(ref="vantaRef")
  slot
</template>
<script setup>
import * as THREE from "three";
import p5 from "p5";
import RIPPLE from "vanta/dist/vanta.ripple.min";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { get, useResizeObserver } from "@vueuse/core";

const props = defineProps({
  options: {
    /** @returns {object} default options */
    default: () => ({}),
    type: Object,
  },
});
const vantaRef = ref(null);
let vantaEffect;
onMounted(() => {
  vantaEffect = RIPPLE({
    el: get(vantaRef).$el,
    THREE,
    p5,
    ...props.options,
  });
});
useResizeObserver(vantaRef, () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
