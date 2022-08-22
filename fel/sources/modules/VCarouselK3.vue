<template>
  <v-carousel
    cycle
    hide-delimiter-background
    show-arrows="hover"
  >
    <v-carousel-item v-for="item in items">
      <slot :item="item" :animate="animate"></slot>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VSingleK3 from "./VSingleK3.vue";
export default {
  props: {
    animate: String,
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: Boolean,
  },
  components: { VSingleK3 },
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
