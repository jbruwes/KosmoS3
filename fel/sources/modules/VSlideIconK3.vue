<template>
  <v-slide-k3 #="slot"
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
  ></v-slide-k3>
</template>
<script setup>
import VSlideK3 from "./VSlideK3.vue";
import VSingleIconK3 from "./VSingleIconK3.vue";
const props = defineProps({
  classes: { default: "ma-4", type: String },
  animate: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
