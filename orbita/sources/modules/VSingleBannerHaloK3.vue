<template>
  <v-single-k3 #="slot"
    ><v-vanta-halo-k3
      :height="height"
      :width="width"
      :mouse-controls="mouseControls"
      :touch-controls="touchControls"
      :gyro-controls="gyroControls"
      :min-height="minHeight"
      :min-width="minWidth"
      :scale="scale"
      :scale-mobile="scaleMobile"
      :base-color="baseColor"
      :color2="color2"
      :background-color="backgroundColor"
      :amplitude-factor="amplitudeFactor"
      :ring-factor="ringFactor"
      :rotation-factor="rotationFactor"
      :x-offset="xOffset"
      :y-offset="yOffset"
      :size="size"
      :speed="speed"
      :mouse-ease="mouseEase"
      ><v-template-banner-k3
        :inner-color="innerColor"
        :animate="animate"
        :classes="classes"
        :title="slot.title"
        :icon="slot.icon"
        :href="slot.href"
        :date="slot.date"
        :description="slot.description"
        :variant="variant"
      ></v-template-banner-k3></v-vanta-halo-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaHaloK3 from "./VVantaHaloK3.vue";
import VTemplateBannerK3 from "./VTemplateBannerK3.vue";

const props = defineProps({
  classes: String,
  innerColor: String,
  animate: String,
  width: [String, Number],
  height: [String, Number],
  variant: String,
  mouseControls: { default: undefined, type: Boolean },
  touchControls: { default: undefined, type: Boolean },
  gyroControls: { default: undefined, type: Boolean },
  minHeight: Number,
  minWidth: Number,
  scale: Number,
  scaleMobile: Number,
  baseColor: Number,
  color2: Number,
  backgroundColor: Number,
  amplitudeFactor: Number,
  ringFactor: Number,
  rotationFactor: Number,
  xOffset: Number,
  yOffset: Number,
  size: Number,
  speed: Number,
  mouseEase: { default: undefined, type: Boolean },
});
</script>
