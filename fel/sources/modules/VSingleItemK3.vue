<template>
  <v-single-k3 #="slot"
    ><v-template-item-k3
      :animate="slot.animate"
      :classes="slot.classes"
      :width="slot.width"
      :height="slot.height"
      :title="slot.title"
      :icon="slot.icon"
      :href="slot.href"
      :subtitle="slot.subtitle"
      :text="slot.text"
      :variant="slot.variant"
    ></v-template-item-k3
  ></v-single-k3>
</template>
<script>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateItemK3 from "./VTemplateItemK3.vue";
export default {
  components: { VSingleK3, VTemplateItemK3 },
};
</script>
