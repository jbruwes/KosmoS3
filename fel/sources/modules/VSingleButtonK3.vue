<template>
  <v-single-k3 #="slot"
    ><v-template-button-k3
      :animate="slot.animate"
      :classes="slot.classes"
      :width="slot.width"
      :height="slot.height"
      :title="slot.title"
      :icon="slot.icon"
      :href="slot.href"
      :variant="slot.variant"
    ></v-template-button-k3
  ></v-single-k3>
</template>
<script>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateButtonK3 from "./VTemplateButtonK3.vue";
export default {
  components: { VSingleK3, VTemplateButtonK3 },
};
</script>
