<template>
  <v-single-k3 #="slot"
    ><v-template-header-k3
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
    ></v-template-header-k3
  ></v-single-k3>
</template>
<script>
import VSingleK3 from "./VSingleK3.vue";
import VTemplateHeaderK3 from "./VTemplateHeaderK3.vue";
export default {
  components: { VSingleK3, VTemplateHeaderK3 },
};
</script>
