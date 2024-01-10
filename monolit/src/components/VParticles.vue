<template lang="pug">
div(:id="id")
  slot
</template>

<script setup>
import { tsParticles } from "@tsparticles/engine";
import { get, set } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  effect: {
    type: String,
    required: true,
    /**
     * @param {string} value - Preset
     * @returns {boolean} - Valid or not
     */
    validator: (value) =>
      [
        "bigCircles",
        "bubbles",
        "confetti",
        "fire",
        "firefly",
        "fireworks",
        "fountain",
        "hyperspace",
        "links",
        "seaAnemone",
        "snow",
        "squares",
        "stars",
        "triangles",
      ].includes(value),
  },
  options: {
    /** @returns {object} - Default options */
    default: () => ({}),
    type: Object,
  },
});
const particles = ref();
const id = ref(crypto.randomUUID());
onMounted(async () => {
  set(
    particles,
    await tsParticles.load({
      id: get(id),
      options: {
        fullScreen: { enable: false },
        preset: props.effect,
        ...props.options,
      },
    }),
  );
});
onUnmounted(() => {
  get(particles)?.destroy();
});
</script>
