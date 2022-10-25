<template lang="pug">
v-slide-k3(#="slot")
  v-single-icon-k3(
    :classes="classes",
    :animate="animate",
    :variant="variant",
    :height="height",
    :width="width"
    :params="slot"
  )
</template>
<script setup>
import VSlideK3 from "./VSlideK3.vue";
import VSingleIconK3 from "./VSingleIconK3.vue";

defineProps({
  classes: { default: "ma-4", type: String },
  animate: { default: undefined, type: String },
  width: { default: 320, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
