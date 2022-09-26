<template>
  <v-single-k3 #="slot"
    ><v-vanta-ripple-k3
      :height="height"
      :width="width"
      :mouseControls="mouseControls"
      :touchControls="touchControls"
      :gyroControls="gyroControls"
      :minHeight="minHeight"
      :minWidth="minWidth"
      :scale="scale"
      :scaleMobile="scaleMobile"
      :color1="color1"
      :color2="color2"
      :backgroundColor="backgroundColor"
      :amplitudeFactor="amplitudeFactor"
      :ringFactor="ringFactor"
      :rotationFactor="rotationFactor"
      :speed="speed"
      ><v-template-banner-k3
        :innerColor="innerColor"
        :animate="animate"
        :classes="classes"
        :title="slot.title"
        :icon="slot.icon"
        :href="slot.href"
        :date="slot.date"
        :description="slot.description"
        :variant="variant"
      ></v-template-banner-k3></v-vanta-ripple-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaRippleK3 from "./VVantaRippleK3.vue";
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
  speed: Number,
});
</script>
