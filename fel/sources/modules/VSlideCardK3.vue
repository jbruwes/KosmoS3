<template>
  <v-slide-k3 #="slot" xpath="*[@id][string(@image)]"
    ><v-single-card-k3
      classes="ma-4"
      :item="slot.item"
      :animate="slot.animate"
      :date="slot.date"
      :description="slot.description"
      :variant="slot.variant"
      :height="slot.height"
      :width="slot.width"
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
