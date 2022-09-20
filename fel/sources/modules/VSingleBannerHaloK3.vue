<template>
  <v-single-k3 #="slot"
    ><v-vanta-halo-k3
      :height="height"
      :width="width"
      :mouseControls="mouseControls"
      :touchControls="touchControls"
      :gyroControls="gyroControls"
      :minHeight="minHeight"
      :minWidth="minWidth"
      :scale="scale"
      :scaleMobile="scaleMobile"
      :baseColor="baseColor"
      :color2="color2"
      :backgroundColor="backgroundColor"
      :amplitudeFactor="amplitudeFactor"
      :ringFactor="ringFactor"
      :rotationFactor="rotationFactor"
      :xOffset="xOffset"
      :yOffset="yOffset"
      :size="size"
      :speed="speed"
      :mouseEase="mouseEase"
      ><v-template-banner-k3
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
