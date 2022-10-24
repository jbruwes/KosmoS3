<template lang="pug">
v-single-k3(#="slot")
  v-template-icon-k3(
    :animate="animate",
    :classes="classes",
    :width="width",
    :height="height",
    :variant="variant",
    :params="slot"
  )
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateIconK3 from "./VTemplateIconK3.vue";

defineProps({
  classes: { default: undefined, type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
