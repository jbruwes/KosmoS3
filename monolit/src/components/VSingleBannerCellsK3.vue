<template lang="pug">
v-single-k3(#="slot", v-bind="params")
  v-vanta-cells-k3(:height="height", :width="width", :options="options")
    v-template-banner-k3(
      :color="color",
      :animate="animate",
      :classes="classes",
      :variant="variant",
      :params="slot"
    )
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VVantaCellsK3 from "./VVantaCellsK3.vue";
import VTemplateBannerK3 from "./VTemplateBannerK3.vue";

defineProps({
  classes: { default: undefined, type: String },
  color: { default: undefined, type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
  options: { default: undefined, type: Object },
  params: { default: undefined, type: Object },
});
</script>
