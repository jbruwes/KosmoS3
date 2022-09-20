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
  classes: { default: undefined, type: String },
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
  skyColor: { default: undefined, type: Number },
  cloudColor: { default: undefined, type: Number },
  cloudShadowColor: { default: undefined, type: Number },
  sunColor: { default: undefined, type: Number },
  sunGlareColor: { default: undefined, type: Number },
  sunlightColor: { default: undefined, type: Number },
  speed: { default: undefined, type: Number },
  mouseEase: { default: undefined, type: Boolean },
});
</script>
