<template lang="pug">
div(ref="vanta")
  slot
</template>
<script setup>
import { get, set, useResizeObserver } from "@vueuse/core";
import p5 from "p5";
import * as THREE from "three";
import BIRDS from "vanta/dist/vanta.birds.min";
import CELLS from "vanta/dist/vanta.cells.min";
import CLOUDS from "vanta/dist/vanta.clouds.min";
import CLOUDS2 from "vanta/dist/vanta.clouds2.min";
import DOTS from "vanta/dist/vanta.dots.min";
import FOG from "vanta/dist/vanta.fog.min";
import GLOBE from "vanta/dist/vanta.globe.min";
import HALO from "vanta/dist/vanta.halo.min";
import NET from "vanta/dist/vanta.net.min";
import RINGS from "vanta/dist/vanta.rings.min";
import RIPPLE from "vanta/dist/vanta.ripple.min";
import TOPOLOGY from "vanta/dist/vanta.topology.min";
import TRUNK from "vanta/dist/vanta.trunk.min";
import WAVES from "vanta/dist/vanta.waves.min";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

const props = defineProps({
  effect: { default: "BIRDS", type: String },
  options: {
    /** @returns {object} Default options */
    default: () => ({}),
    type: Object,
  },
});
const effects = reactive({
  BIRDS,
  CELLS,
  CLOUDS,
  CLOUDS2,
  DOTS,
  FOG,
  GLOBE,
  HALO,
  NET,
  RINGS,
  RIPPLE,
  TOPOLOGY,
  TRUNK,
  WAVES,
});
const vanta = ref(null);
const vantaEffect = ref();
onMounted(() => {
  set(
    vantaEffect,
    effects[props.effect]({
      el: get(vanta),
      THREE,
      p5,
      ...props.options,
    }),
  );
});
useResizeObserver(vanta, () => {
  get(vantaEffect)?.resize();
});
onBeforeUnmount(() => {
  get(vantaEffect)?.destroy();
});
</script>
