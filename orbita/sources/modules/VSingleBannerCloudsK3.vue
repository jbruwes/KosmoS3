<template>
  <v-single-k3 #="slot"
    ><v-vanta-clouds-k3
      :height="height"
      :width="width"
      :mouseControls="mouseControls"
      :touchControls="touchControls"
      :gyroControls="gyroControls"
      :minHeight="minHeight"
      :minWidth="minWidth"
      :scale="scale"
      :scaleMobile="scaleMobile"
      :backgroundColor="backgroundColor"
      :skyColor="skyColor"
      :cloudColor="cloudColor"
      :cloudShadowColor="cloudShadowColor"
      :sunColor="sunColor"
      :sunGlareColor="sunGlareColor"
      :sunlightColor="sunlightColor"
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
      ></v-template-banner-k3></v-vanta-clouds-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaCloudsK3 from "./VVantaCloudsK3.vue";
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
