<template>
  <v-carousel cycle show-arrows="hover" :height="height" :width="width">
    <v-carousel-item v-for="(item, i) in items" :key="i">
      <slot
        :item="item"
        :animate="animate"
        :date="date"
        :variant="variant"
        :description="description"
      ></slot>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
import { mapActions } from "pinia";
import core from "~/core.js";
export default {
  props: {
    animate: String,
    date: { default: false, type: [Boolean, String] },
    description: { default: true, type: [Boolean, String] },
    variant: String,
    height: [String, Number],
    width: [String, Number],
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: { default: undefined, type: Boolean },
    xpath: { default: "*[@id]", type: String },
  },
  computed: {
    items() {
      return this.getItems(
        this.deep,
        this.length,
        this.reveal,
        this.sort,
        this.path,
        this.children,
        this.xpath,
      );
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
