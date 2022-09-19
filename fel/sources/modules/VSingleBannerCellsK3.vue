<template>
  <v-single-k3 #="slot"
    ><v-vanta-cells-k3 :height="slot.height" :width="slot.width"
      ><v-template-banner-k3
        :animate="slot.animate"
        :classes="slot.classes"
        :title="slot.title"
        :icon="slot.icon"
        :href="slot.href"
        :date="slot.date"
        :description="slot.description"
        :variant="slot.variant"
      ></v-template-banner-k3></v-vanta-cells-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaCellsK3 from "./VVantaCellsK3.vue";
import VTemplateBannerK3 from "./VTemplateBannerK3.vue";
</script>
