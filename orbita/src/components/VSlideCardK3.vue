<template>
  <v-slide-k3 #="slot" selector="*[@id][string(@image)]"
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
  ></v-slide-k3>
</template>
<script setup>
import VSlideK3 from "./VSlideK3.vue";
import VSingleCardK3 from "./VSingleCardK3.vue";

defineProps({
  classes: { default: "ma-4", type: String },
  animate: { default: undefined, type: String },
  width: { default: 320, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
});
</script>
