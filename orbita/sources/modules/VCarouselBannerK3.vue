<template>
  <v-carousel-k3
    #="slot"
    selector="*[@id][string(@image)]"
    :width="width"
    :height="height"
  >
    <v-single-banner-k3
      :classes="classes"
      :item="slot.item"
      :innerColor="innerColor"
      :animate="animate"
      :date="slot.date"
      :variant="variant"
    ></v-single-banner-k3
  ></v-carousel-k3>
</template>
<script setup>
import VCarouselK3 from "./VCarouselK3.vue";
import VSingleBannerK3 from "./VSingleBannerK3.vue";
const props = defineProps({
  classes: String,
  innerColor: String,
  animate: String,
  width: [String, Number],
  height: [String, Number],
  variant: String,
});
</script>
