<template>
  <v-single-k3 #="slot"
    ><v-vanta-clouds-k3
      :height="height"
      :width="width"
      :mouse-controls="mouseControls"
      :touch-controls="touchControls"
      :gyro-controls="gyroControls"
      :min-height="minHeight"
      :min-width="minWidth"
      :scale="scale"
      :scale-mobile="scaleMobile"
      :background-color="backgroundColor"
      :sky-color="skyColor"
      :cloud-color="cloudColor"
      :cloud-shadow-color="cloudShadowColor"
      :sun-color="sunColor"
      :sun-glare-color="sunGlareColor"
      :sunlight-color="sunlightColor"
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
      ></v-template-banner-k3></v-vanta-clouds-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaCloudsK3 from "./VVantaCloudsK3.vue";
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
  backgroundColor: Number,
  skyColor: Number,
  cloudColor: Number,
  cloudShadowColor: Number,
  sunColor: Number,
  sunGlareColor: Number,
  sunlightColor: Number,
  speed: Number,
  mouseEase: { default: undefined, type: Boolean },
});
</script>
