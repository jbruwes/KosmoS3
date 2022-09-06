<template>
  <v-single-k3 #="slot"
    ><v-template-card-k3
      :animate="slot.animate"
      :classes="slot.classes"
      :width="slot.width"
      :height="slot.height"
      :title="slot.title"
      :icon="slot.icon"
      :image="slot.image"
      :href="slot.href"
      :subtitle="slot.subtitle"
      :text="slot.text"
      :variant="slot.variant"
    ></v-template-card-k3
  ></v-single-k3>
</template>
<script>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateCardK3 from "./VTemplateCardK3.vue";
export default {
  components: { VSingleK3, VTemplateCardK3 },
};
</script>
