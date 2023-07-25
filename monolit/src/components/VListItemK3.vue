<template lang="pug">
v-list-k3(#="slot")
  v-single-item-k3(
    :classes="classes",
    :animate="animate",
    :variant="variant",
    :height="height",
    :width="width",
    :params="slot"
  )
</template>
<script setup>
import VListK3 from "./VListK3.vue";
import VSingleItemK3 from "./VSingleItemK3.vue";

defineProps({
  classes: { default: "ma-4", type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
