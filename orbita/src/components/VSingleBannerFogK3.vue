<template lang="pug">
v-single-k3(#="slot")
  v-vanta-fog-k3(
    :height="height",
    :width="width",
    :mouse-controls="mouseControls",
    :touch-controls="touchControls",
    :gyro-controls="gyroControls",
    :min-height="minHeight",
    :min-width="minWidth",
    :scale="scale",
    :scale-mobile="scaleMobile",
    :highlight-color="highlightColor",
    :midtone-color="midtoneColor",
    :lowlight-color="lowlightColor",
    :base-color="baseColor",
    :blur-factor="blurFactor",
    :speed="speed",
    :zoom="zoom"
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
import VVantaFogK3 from "./VVantaFogK3.vue";
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
  highlightColor: { default: undefined, type: Number },
  midtoneColor: { default: undefined, type: Number },
  lowlightColor: { default: undefined, type: Number },
  baseColor: { default: undefined, type: Number },
  blurFactor: { default: undefined, type: Number },
  speed: { default: undefined, type: Number },
  zoom: { default: undefined, type: Number },
});
</script>
