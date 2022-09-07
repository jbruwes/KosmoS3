<template>
  <v-grid-k3 #="slot" xpath="*[@id][string(@image)]"
    ><v-single-card-k3
      classes="fill-height ma-auto"
      :item="slot.item"
      :animate="slot.animate"
      :date="slot.date"
      :description="slot.description"
      :variant="slot.variant"
      :height="slot.height"
      :width="slot.width"
    ></v-single-card-k3
  ></v-grid-k3>
</template>
<script>
import VGridK3 from "./VGridK3.vue";
import VSingleCardK3 from "./VSingleCardK3.vue";
export default {
  components: { VGridK3, VSingleCardK3 },
};
</script>
