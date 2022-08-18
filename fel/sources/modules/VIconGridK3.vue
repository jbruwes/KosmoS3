<template>
  <v-grid-k3 #="slot"
    ><v-icon-k3
      class="fill-height ma-auto"
      :animate="slot.animate"
      :item="slot.item"
    ></v-icon-k3
  ></v-grid-k3>
</template>
<script>
import VGridK3 from "./VGridK3.vue";
import VIconK3 from "./VIconK3.vue";
export default {
  components: { VGridK3, VIconK3 },
};
</script>
