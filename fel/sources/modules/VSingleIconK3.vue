<template>
  <v-single-k3 #="slot"
    ><v-template-icon-k3
      :animate="slot.animate"
      :classes="slot.classes"
      :width="slot.width"
      :height="slot.height"
      :title="slot.title"
      :icon="slot.icon"
      :href="slot.href"
      :date="slot.date"
      :description="slot.description"
      :variant="slot.variant"
    ></v-template-icon-k3
  ></v-single-k3>
</template>
<script>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateIconK3 from "./VTemplateIconK3.vue";
export default {
  components: { VSingleK3, VTemplateIconK3 },
};
</script>
