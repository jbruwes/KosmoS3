<template>
  <v-single-k3 #="slot"
    ><v-vanta-globe-k3
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
      :color2="color2"
      :size="size"
      :backgroundColor="backgroundColor"
      :points="points"
      :maxDistance="maxDistance"
      :spacing="spacing"
      :showDots="showDots"
      ><v-template-banner-k3
        :animate="animate"
        :classes="classes"
        :title="slot.title"
        :icon="slot.icon"
        :href="slot.href"
        :date="slot.date"
        :description="slot.description"
        :variant="variant"
      ></v-template-banner-k3></v-vanta-globe-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaGlobeK3 from "./VVantaGlobeK3.vue";
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
  color: { default: 0xff3f81, type: Number },
  color2: { default: 0xffffff, type: Number },
  size: { default: 1, type: Number },
  backgroundColor: { default: 0x23153c, type: Number },
  points: { default: 10, type: Number },
  maxDistance: { default: 20, type: Number },
  spacing: { default: 15, type: Number },
  showDots: { default: true, type: Boolean },
});
</script>
