<template>
  <v-single-k3 #="slot"
    ><v-template-item-k3
      :animate="animate"
      :classes="classes"
      :width="width"
      :height="height"
      :title="slot.title"
      :icon="slot.icon"
      :href="slot.href"
      :date="slot.date"
      :description="slot.description"
      :variant="variant"
    ></v-template-item-k3
  ></v-single-k3>
</template>
<script setup>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateItemK3 from "./VTemplateItemK3.vue";
const props = defineProps({
  classes: String,
  animate: String,
  width: [String, Number],
  height: [String, Number],
  variant: String,
});
</script>
