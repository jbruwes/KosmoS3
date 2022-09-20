<template>
  <v-grid-k3 #="slot" selector="*[@id][string(@image)]"
    ><v-single-card-k3
      :classes="classes"
      :item="slot.item"
      :animate="animate"
      :date="slot.date"
      :description="slot.description"
      :variant="variant"
      :height="height"
      :width="width"
    ></v-single-card-k3
  ></v-grid-k3>
</template>
<script setup>
import VGridK3 from "./VGridK3.vue";
import VSingleCardK3 from "./VSingleCardK3.vue";
const props = defineProps({
  classes: { default: "fill-height ma-auto", type: String },
  animate: String,
  width: [String, Number],
  height: [String, Number],
  variant: String,
});
</script>
