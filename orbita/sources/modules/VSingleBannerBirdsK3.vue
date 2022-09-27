<template>
  <v-single-k3 #="slot"
    ><v-vanta-birds-k3
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
      :color1="color1"
      :color2="color2"
      :color-mode="colorMode"
      :bird-size="birdSize"
      :wing-span="wingSpan"
      :speed-limit="speedLimit"
      :separation="separation"
      :alignment="alignment"
      :cohesion="cohesion"
      :quantity="quantity"
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
      ></v-template-banner-k3></v-vanta-birds-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaBirdsK3 from "./VVantaBirdsK3.vue";
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
  color1: Number,
  color2: Number,
  colorMode: String,
  birdSize: Number,
  wingSpan: Number,
  speedLimit: Number,
  separation: Number,
  alignment: Number,
  cohesion: Number,
  quantity: Number,
});
</script>
