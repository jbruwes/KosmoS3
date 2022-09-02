<template>
  <v-list-k3 #="slot"
    ><v-single-item-k3
      class="ma-4"
      :item="slot.item"
      :animate="slot.animate"
      :date="slot.date"
      :variant="slot.variant"
      :height="slot.height"
      :width="slot.width"
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
