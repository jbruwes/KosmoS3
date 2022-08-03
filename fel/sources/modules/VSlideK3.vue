<template>
  <v-slide-group show-arrows>
    <v-slide-group-item v-for="item in items">
      <v-item-k3
        :item="item"
        :class="class"
        :width="width"
        :height="height"
        :icon="icon"
        :date="date"
        :title="title"
        :image="image"
        :href="href"
        :description="description"
        :type="type"
      ></v-item-k3>
    </v-slide-group-item>
  </v-slide-group>
</template>
<script>
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VItemK3 from "./VItemK3.vue";
export default {
  props: {
    class: { default: "ma-4", type: String },
    width: Number,
    height: Number,
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
    type: String,
  },
  components: { VItemK3 },
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
