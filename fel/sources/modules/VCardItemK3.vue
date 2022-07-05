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
    :href="href"
  ></v-card-k3>
</template>
<script>
import { mapState, mapActions } from "pinia";
import core from "../stores/core.js";
import VCardK3 from "./VCardK3.vue";
export default {
  props: { item: Object },
  components: { VCardK3 },
  computed: {
    ...mapState(core, ["routePath"]),
    href() {
      let href = this.item ? this.getPath(this.item) : "";
      return href === this.routePath ? "" : href;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath"]) },
};
</script>
