<template>
  <v-single-k3 #="slot"
    ><v-template-banner-k3
      :animate="slot.animate"
      :classes="slot.classes"
      :width="slot.width"
      :height="slot.height"
      :title="slot.title"
      :icon="slot.icon"
      :image="slot.image"
      :href="slot.href"
      :date="slot.sate"
      :description="slot.description"
      :variant="slot.variant"
    ></v-template-banner-k3
  ></v-single-k3>
</template>
<script>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateBannerK3 from "./VTemplateBannerK3.vue";
export default {
  components: { VSingleK3, VTemplateBannerK3 },
};
</script>
