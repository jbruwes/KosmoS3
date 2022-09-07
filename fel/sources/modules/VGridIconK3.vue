<template>
  <v-grid-k3 #="slot"
    ><v-single-icon-k3
      :item="slot.item"
      :animate="slot.animate"
      :date="slot.date"
      :variant="slot.variant"
      :height="slot.height"
      :width="slot.width"
    ></v-single-icon-k3
  ></v-grid-k3>
</template>
<script>
import VGridK3 from "./VGridK3.vue";
import VSingleIconK3 from "./VSingleIconK3.vue";
export default {
  components: { VGridK3, VSingleIconK3 },
};
</script>
