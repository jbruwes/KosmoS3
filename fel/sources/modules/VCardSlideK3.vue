<template>
  <v-slide-k3 #="slot"
    ><v-card-k3
      class="ma-4"
      :animate="slot.animate"
      :item="slot.item"
      :width="slot.width"
    ></v-card-k3
  ></v-slide-k3>
</template>
<script>
import VSlideK3 from "./VSlideK3.vue";
import VCardK3 from "./VCardK3.vue";
export default {
  components: { VSlideK3, VCardK3 },
};
</script>
