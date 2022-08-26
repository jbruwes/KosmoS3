<template>
  <v-grid-k3 #="slot"
    ><v-single-card-k3
      class="fill-height ma-auto"
      :animate="slot.animate"
      :item="slot.item"
      :variant="slot.variant"
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
