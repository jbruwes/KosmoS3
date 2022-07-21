<template>
  <v-slide-group show-arrows>
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
    animate: String,
    class: { default: "ma-4", type: String },
    width: Number,
    icon: String,
    date: String,
    title: String,
    image: String,
    href: String,
    description: String,
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: Boolean,
  },
  components: { VCardItemK3 },
  computed: {
    items() {
      return this.getItems(
        this.deep,
        this.length,
        this.reveal,
        this.sort,
        this.path,
        this.children,
        "*[@id]"
      );
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
