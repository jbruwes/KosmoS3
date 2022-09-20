<template>
  <v-single-k3 #="slot"
    ><v-vanta-waves-k3
      :height="height"
      :width="width"
      :mouseControls="mouseControls"
      :touchControls="touchControls"
      :gyroControls="gyroControls"
      :minHeight="minHeight"
      :minWidth="minWidth"
      :scale="scale"
      :scaleMobile="scaleMobile"
      :color="color"
      :shininess="shininess"
      :waveHeight="waveHeight"
      :waveSpeed="waveSpeed"
      :zoom="zoom"
      ><v-template-banner-k3
        :animate="animate"
        :classes="classes"
        :title="slot.title"
        :icon="slot.icon"
        :href="slot.href"
        :date="slot.date"
        :description="slot.description"
        :variant="variant"
      ></v-template-banner-k3></v-vanta-waves-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaWavesK3 from "./VVantaWavesK3.vue";
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
  color: { default: undefined, type: Number },
  shininess: { default: undefined, type: Number },
  waveHeight: { default: undefined, type: Number },
  waveSpeed: { default: undefined, type: Number },
  zoom: { default: undefined, type: Number },
});
</script>
