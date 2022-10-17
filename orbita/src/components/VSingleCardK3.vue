<template lang="pug">
v-single-k3(#="slot")
  v-template-card-k3(
    :animate="animate",
    :classes="classes",
    :width="width",
    :height="height",
    :title="slot.title",
    :icon="slot.icon",
    :image="slot.image",
    :href="slot.href",
    :date="slot.date",
    :description="slot.description",
    :variant="variant"
  )
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateCardK3 from "./VTemplateCardK3.vue";

defineProps({
  classes: { default: undefined, type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
