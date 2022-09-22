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
  color: Number,
  color2: Number,
  size: Number,
  backgroundColor: Number,
  points: Number,
  maxDistance: Number,
  spacing: Number,
  showDots: { default: undefined, type: Boolean },
});
</script>
