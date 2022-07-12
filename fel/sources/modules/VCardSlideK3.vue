<template>
  <v-slide-group>
    <v-slide-group-item v-for="item in items">
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
    </v-slide-group-item>
  </v-slide-group>
</template>
<script>
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VCardItemK3 from "./VCardItemK3.vue";
export default {
  props: {
    path: String,
    animate: String,
    class: { default: "ma-4", type: String },
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
    items() {
      return this.getItems(null, null, null, null, this.path, null, "*");
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
