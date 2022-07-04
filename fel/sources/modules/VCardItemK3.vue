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
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VCardK3 from "./VCardK3.vue";
export default {
  props: {
    item: Object,
  },
  components: {
    VCardK3,
  },
  methods: {
    ...mapActions(core, ["getTitle", "getPath"]),
  },
};
</script>
