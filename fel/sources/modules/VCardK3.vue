<template>
  <v-item-k3 #="slot"
    ><v-card-template-k3
      :animate="slot.animate"
      :class="slot.class"
      :width="slot.width"
      :height="slot.height"
      :title="slot.title"
      :icon="slot.icon"
      :image="slot.image"
      :href="slot.href"
      :path="slot.path"
      :item="slot.item"
      :date="slot.date"
      :description="slot.description"
    ></v-card-template-k3
  ></v-item-k3>
</template>
<script>
import VItemK3 from "./VItemK3.vue";
import VCardTemplateK3 from "./VCardTemplateK3.vue";
export default {
  components: { VItemK3, VCardTemplateK3 },
};
</script>
