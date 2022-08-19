<template>
  <v-slide-k3 #="slot"
    ><v-single-icon-k3
      class="ma-4"
      :animate="slot.animate"
      :item="slot.item"
      :width="slot.width"
    ></v-single-icon-k3
  ></v-slide-k3>
</template>
<script>
import VSlideK3 from "./VSlideK3.vue";
import VSingleIconK3 from "./VSingleIconK3.vue";
export default {
  components: { VSlideK3, VSingleIconK3 },
};
</script>
