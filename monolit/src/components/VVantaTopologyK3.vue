<template lang="pug">
v-sheet(ref="vantaRef")
  slot
</template>
<script setup>
import { get, useResizeObserver } from "@vueuse/core";
import p5 from "p5";
import * as THREE from "three";
import TOPOLOGY from "vanta/dist/vanta.topology.min";
import { onBeforeUnmount, onMounted, ref } from "vue";

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
  vantaEffect = TOPOLOGY({
    el: get(vantaRef).$el,
    THREE,
    p5,
    ...props.options,
  });
});
useResizeObserver(vantaRef, async () => {
  if (vantaEffect) vantaEffect.resize();
});
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy();
});
</script>
