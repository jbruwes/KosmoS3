<template lang="pug">
v-single-k3(#="slot")
  v-vanta-dots-k3(
    :height="height",
    :width="width",
    :mouse-controls="mouseControls",
    :touch-controls="touchControls",
    :gyro-controls="gyroControls",
    :min-height="minHeight",
    :min-width="minWidth",
    :scale="scale",
    :scale-mobile="scaleMobile",
    :color="color",
    :color2="color2",
    :background-color="backgroundColor",
    :size="size",
    :spacing="spacing",
    :show-lines="showLines"
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
import VVantaDotsK3 from "./VVantaDotsK3.vue";
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
  color: { default: undefined, type: Number },
  color2: { default: undefined, type: Number },
  backgroundColor: { default: undefined, type: Number },
  size: { default: undefined, type: Number },
  spacing: { default: undefined, type: Number },
  showLines: { default: undefined, type: Boolean },
});
</script>
