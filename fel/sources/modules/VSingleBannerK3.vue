<template>
  <v-single-k3 #="slot"
    ><v-parallax
      :height="slot.height"
      :width="slot.width"
      :src="slot.image"
      :eager="true"
      :aspect-ratio="1"
      ><v-template-banner-k3
        :animate="slot.animate"
        :classes="slot.classes"
        :title="slot.title"
        :icon="slot.icon"
        :href="slot.href"
        :date="slot.date"
        :description="slot.description"
        :variant="slot.variant"
      ></v-template-banner-k3></v-parallax
  ></v-single-k3>
</template>
<script>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateBannerK3 from "./VTemplateBannerK3.vue";
export default {
  components: { VSingleK3, VTemplateBannerK3 },
};
</script>
