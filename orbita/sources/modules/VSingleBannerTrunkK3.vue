<template>
  <v-single-k3 #="slot"
    ><v-vanta-trunk-k3
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
      :backgroundColor="backgroundColor"
      :spacing="spacing"
      :chaos="chaos"
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
      ></v-template-banner-k3></v-vanta-trunk-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaTrunkK3 from "./VVantaTrunkK3.vue";
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
  color: Number,
  backgroundColor: Number,
  spacing: Number,
  chaos: Number,
});
</script>
