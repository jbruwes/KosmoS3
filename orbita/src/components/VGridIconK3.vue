<template>
  <v-grid-k3 #="slot"
    ><v-single-icon-k3
      :classes="classes"
      :item="slot.item"
      :animate="animate"
      :date="slot.date"
      :description="slot.description"
      :variant="variant"
      :height="height"
      :width="width"
    ></v-single-icon-k3
  ></v-grid-k3>
</template>
<script setup>
import VGridK3 from "./VGridK3.vue";
import VSingleIconK3 from "./VSingleIconK3.vue";

defineProps({
  classes: { default: undefined, type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
