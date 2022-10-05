<template>
  <v-list-k3 #="slot"
    ><v-single-item-k3
      :classes="classes"
      :item="slot.item"
      :animate="animate"
      :date="slot.date"
      :description="slot.description"
      :variant="variant"
      :height="height"
      :width="width"
    ></v-single-item-k3
  ></v-list-k3>
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
