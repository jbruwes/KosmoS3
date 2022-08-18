<template>
  <v-item-k3 #="slot"
    ><v-icon-template-k3
      :animate="slot.animate"
      :class="slot.class"
      :width="slot.width"
      :height="slot.height"
      :minWidth="slot.minWidth"
      :minHeight="slot.minHeight"
      :title="slot.title"
      :icon="slot.icon"
      :href="slot.href"
      :path="slot.path"
      :item="slot.item"
      :subtitle="slot.subtitle"
      :text="slot.text"
    ></v-icon-template-k3
  ></v-item-k3>
</template>
<script>
import VItemK3 from "./VItemK3.vue";
import VIconTemplateK3 from "./VIconTemplateK3.vue";
export default {
  components: { VItemK3, VIconTemplateK3 },
};
</script>
