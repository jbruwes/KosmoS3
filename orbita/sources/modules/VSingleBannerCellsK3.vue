<template>
  <v-single-k3 #="slot"
    ><v-vanta-cells-k3
      :height="height"
      :width="width"
      :mouse-controls="mouseControls"
      :touch-controls="touchControls"
      :gyro-controls="gyroControls"
      :min-height="minHeight"
      :min-width="minWidth"
      :scale="scale"
      :scale-mobile="scaleMobile"
      :color1="color1"
      :color2="color2"
      :background-color="backgroundColor"
      :amplitude-factor="amplitudeFactor"
      :ring-factor="ringFactor"
      :rotation-factor="rotationFactor"
      :size="size"
      :speed="speed"
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
      ></v-template-banner-k3></v-vanta-cells-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaCellsK3 from "./VVantaCellsK3.vue";
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
  color1: Number,
  color2: Number,
  backgroundColor: Number,
  amplitudeFactor: Number,
  ringFactor: Number,
  rotationFactor: Number,
  size: Number,
  speed: Number,
});
</script>
