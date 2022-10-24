<template lang="pug">
v-single-k3(#="slot")
  v-vanta-rings-k3(:height="height", :width="width", :options="options")
    v-template-banner-k3(
      :color="color",
      :animate="animate",
      :classes="classes",
      :title="slot.title",
      :icon="slot.icon",
      :href="slot.href",
      :date="slot.date",
      :description="slot.description",
      :variant="variant",
      :item="slot.item"
    )
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaRingsK3 from "./VVantaRingsK3.vue";
import VTemplateBannerK3 from "./VTemplateBannerK3.vue";

defineProps({
  classes: { default: undefined, type: String },
  color: { default: undefined, type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
  options: { default: undefined, type: Object },
});
</script>
