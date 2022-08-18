<template>
  <v-slide-k3 #="slot"
    ><v-icon-k3
      class="ma-4"
      :animate="slot.animate"
      :item="slot.item"
      :width="slot.width"
    ></v-icon-k3
  ></v-slide-k3>
</template>
<script>
import VSlideK3 from "./VSlideK3.vue";
import VIconK3 from "./VIconK3.vue";
export default {
  components: { VSlideK3, VIconK3 },
};
</script>
