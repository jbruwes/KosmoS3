<template lang="pug">
v-single-k3(#="slot")
  v-vanta-birds-k3(
    :height="height",
    :width="width",
    :mouse-controls="mouseControls",
    :touch-controls="touchControls",
    :gyro-controls="gyroControls",
    :min-height="minHeight",
    :min-width="minWidth",
    :scale="scale",
    :scale-mobile="scaleMobile",
    :background-color="backgroundColor",
    :color1="color1",
    :color2="color2",
    :color-mode="colorMode",
    :bird-size="birdSize",
    :wing-span="wingSpan",
    :speed-limit="speedLimit",
    :separation="separation",
    :alignment="alignment",
    :cohesion="cohesion",
    :quantity="quantity"
  )
    v-template-banner-k3(
      :inner-color="innerColor",
      :animate="animate",
      :classes="classes",
      :title="slot.title",
      :icon="slot.icon",
      :href="slot.href",
      :date="slot.date",
      :description="slot.description",
      :variant="variant"
    )
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaBirdsK3 from "./VVantaBirdsK3.vue";
import VTemplateBannerK3 from "./VTemplateBannerK3.vue";

defineProps({
  classes: { default: undefined, type: String },
  innerColor: { default: undefined, type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
  mouseControls: { default: undefined, type: Boolean },
  touchControls: { default: undefined, type: Boolean },
  gyroControls: { default: undefined, type: Boolean },
  minHeight: { default: undefined, type: Number },
  minWidth: { default: undefined, type: Number },
  scale: { default: undefined, type: Number },
  scaleMobile: { default: undefined, type: Number },
  backgroundColor: { default: undefined, type: Number },
  color1: { default: undefined, type: Number },
  color2: { default: undefined, type: Number },
  colorMode: { default: undefined, type: String },
  birdSize: { default: undefined, type: Number },
  wingSpan: { default: undefined, type: Number },
  speedLimit: { default: undefined, type: Number },
  separation: { default: undefined, type: Number },
  alignment: { default: undefined, type: Number },
  cohesion: { default: undefined, type: Number },
  quantity: { default: undefined, type: Number },
});
</script>
