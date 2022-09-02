<template>
  <v-slide-k3 #="slot"
    ><v-single-card-k3
      class="ma-4"
      :item="item"
      :animate="animate"
      :date="date"
      :variant="variant"
      :width="width"
      :height="height"
    ></v-single-card-k3
  ></v-slide-k3>
</template>
<script>
import VSlideK3 from "./VSlideK3.vue";
import VSingleCardK3 from "./VSingleCardK3.vue";
export default {
  components: { VSlideK3, VSingleCardK3 },
};
</script>
