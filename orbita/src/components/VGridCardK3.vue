<template lang="pug">
v-grid-k3(#="slot", selector="*[@id][string(@image)]")
  v-single-card-k3(
    :classes="classes",
    :item="slot.item",
    :animate="animate",
    :date="slot.date",
    :description="slot.description",
    :variant="variant",
    :height="height",
    :width="width"
  )
</template>
<script setup>
import VGridK3 from "./VGridK3.vue";
import VSingleCardK3 from "./VSingleCardK3.vue";

defineProps({
  classes: { default: "h-100 ma-auto", type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
