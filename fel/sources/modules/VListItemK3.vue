<template>
  <v-list-k3 #="slot"
    ><v-single-item-k3
      class="ma-4"
      :animate="slot.animate"
      :item="slot.item"
      :width="slot.width"
      :variant="slot.variant"
    ></v-single-item-k3
  ></v-list-k3>
</template>
<script>
import VListK3 from "./VListK3.vue";
import VSingleItemK3 from "./VSingleItemK3.vue";
export default {
  components: { VListK3, VSingleItemK3 },
};
</script>
