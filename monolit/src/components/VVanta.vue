<template lang="pug">
div(ref="vantaRef")
  slot
</template>
<script setup>
import { get, set, useResizeObserver } from "@vueuse/core";
import p5 from "p5";
import * as THREE from "three";
import BIRDS from "vanta/dist/vanta.birds.min";
import CELLS from "vanta/dist/vanta.cells.min";
import CLOUDS from "vanta/dist/vanta.clouds.min";
import FOG from "vanta/dist/vanta.fog.min";
import GLOBE from "vanta/dist/vanta.globe.min";
import HALO from "vanta/dist/vanta.halo.min";
import NET from "vanta/dist/vanta.net.min";
import RINGS from "vanta/dist/vanta.rings.min";
import RIPPLE from "vanta/dist/vanta.ripple.min";
import TRUNK from "vanta/dist/vanta.trunk.min";
import WAVES from "vanta/dist/vanta.waves.min";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

const props = defineProps({
  effect: {
    required: true,
    type: String,
    /**
     * @param {string} value - Preset
     * @returns {boolean} - Valid or not
     */
    validator: (value) =>
      [
        "birds",
        "cells",
        "clouds",
        "fog",
        "globe",
        "halo",
        "net",
        "rings",
        "ripple",
        "trunk",
        "waves",
      ].includes(value),
  },
  options: {
    /** @returns {object} Default options */
    default: () => ({}),
    type: Object,
  },
});
const effects = reactive({
  birds: BIRDS,
  cells: CELLS,
  clouds: CLOUDS,
  fog: FOG,
  globe: GLOBE,
  halo: HALO,
  net: NET,
  rings: RINGS,
  ripple: RIPPLE,
  trunk: TRUNK,
  waves: WAVES,
});
const vantaRef = ref(null);
const vantaEffect = ref();
onMounted(() => {
  set(
    vantaEffect,
    effects?.[props.effect]?.({
      el: get(vantaRef),
      THREE,
      p5,
      ...props.options,
    }),
  );
});
useResizeObserver(vantaRef, () => {
  get(vantaEffect)?.resize();
});
onBeforeUnmount(() => {
  get(vantaEffect)?.destroy();
});
</script>
