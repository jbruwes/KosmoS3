<template lang="pug">
v-carousel-k3(
  #="slot",
  selector="*[@id][string(@image)]",
  :width="width",
  :height="height"
)
  v-single-banner-k3(
    :classes="classes",
    :color="color",
    :animate="animate",
    :variant="variant",
    :params="slot"
  )
</template>
<script setup>
import VCarouselK3 from "./VCarouselK3.vue";
import VSingleBannerK3 from "./VSingleBannerK3.vue";

defineProps({
  classes: { default: undefined, type: String },
  color: { default: undefined, type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
