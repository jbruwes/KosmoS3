<template>
  <v-card-item-k3
    :item="item"
    :animate="animate"
    :class="class"
    :width="width"
    :icon="icon"
    :date="date"
    :title="title"
    :image="image"
    :href="href"
    :description="description"
  ></v-card-item-k3>
</template>
<script>
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VCardItemK3 from "./VCardItemK3.vue";
export default {
  props: {
    path: String,
    animate: String,
    class: String,
    width: Number,
    icon: String,
    date: String,
    title: String,
    image: String,
    href: String,
    description: String,
  },
  components: { VCardItemK3 },
  computed: {
    item() {
      const items = this.getItems(null, null, null, null, this.path);
      return items.length ? items[0] : undefined;
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
