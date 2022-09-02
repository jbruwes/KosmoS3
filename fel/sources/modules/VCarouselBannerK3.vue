<template>
  <v-carousel-k3 #="slot"
    ><v-single-banner-k3
      :item="slot.item"
      :animate="slot.animate"
      :date="slot.date"
      :variant="slot.variant"
    ></v-single-banner-k3
  ></v-carousel-k3>
</template>
<script>
import VCarouselK3 from "./VCarouselK3.vue";
import VSingleBannerK3 from "./VSingleBannerK3.vue";
export default {
  components: { VCarouselK3, VSingleBannerK3 },
};
</script>
