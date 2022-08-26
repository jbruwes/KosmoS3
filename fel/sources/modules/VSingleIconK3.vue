<template>
  <v-single-k3 #="slot"
    ><v-template-icon-k3
      :animate="slot.animate"
      :class="slot.class"
      :width="slot.width"
      :height="slot.height"
      :title="slot.title"
      :icon="slot.icon"
      :href="slot.href"
      :path="slot.path"
      :item="slot.item"
      :subtitle="slot.subtitle"
      :text="slot.text"
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
