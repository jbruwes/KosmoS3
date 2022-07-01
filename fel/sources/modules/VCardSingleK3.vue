<template>
  <v-card-k3
    :title="item ? getTitle(item) : ''"
    :subtitle="
      item
        ? new Date(item.date ? item.date : item.lastmod).toLocaleDateString()
        : ''
    "
    :text="item ? item.description : ''"
    :icon="item ? `mdi-${item.icon}` : ''"
    :img="item ? item.image : ''"
    :href="item ? getPath(item) : ''"
  ></v-card-k3>
</template>
<script>
import defineStore from "../stores/core.js";
import VCardK3 from "./VCardK3.vue";
export default {
  props: {
    path: String,
  },
  components: {
    VCardK3,
  },
  setup() {
    const core = defineStore();
    const { getTitle, getPath, getItems } = core;
    return { getTitle, getPath, getItems };
  },
  computed: {
    item() {
      const items = this.getItems(
        null,
        null,
        null,
        null,
        this.path ? [this.path] : undefined
      );
      return items.length ? items[0] : undefined;
    },
  },
};
</script>
