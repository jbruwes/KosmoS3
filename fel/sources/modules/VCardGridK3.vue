<template>
  <v-grid-k3 #="slot"
    ><v-card-k3
      class="fill-height ma-auto"
      :animate="slot.animate"
      :item="slot.item"
    ></v-card-k3
  ></v-grid-k3>
</template>
<script>
import VGridK3 from "./VGridK3.vue";
import VCardK3 from "./VCardK3.vue";
export default {
  components: { VGridK3, VCardK3 },
};
</script>
