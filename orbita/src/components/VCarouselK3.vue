<template>
  <v-carousel cycle show-arrows="hover" :height="height" :width="width">
    <v-carousel-item v-for="(item, i) in items" :key="i" :ripple="true">
      <slot :item="item" :date="date" :description="description"></slot>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
import { mapActions } from "pinia";
import sputnik from "@/sputnik";

export default {
  props: {
    date: { default: false, type: [Boolean, String] },
    description: { default: true, type: [Boolean, String] },
    deep: { default: undefined, type: Boolean },
    length: { default: undefined, type: Number },
    reveal: { default: undefined, type: Boolean },
    sort: { default: undefined, type: String },
    path: { default: undefined, type: String },
    children: { default: undefined, type: Boolean },
    selector: { default: "*[@id]", type: String },
    axe: { default: undefined, type: String },
  },
  computed: {
    /**
     * @returns {Array} Слайды карусели
     */
    items() {
      return this.getItems(
        this.deep,
        this.length,
        this.reveal,
        this.sort,
        this.path,
        this.children,
        this.selector,
        this.axe
      );
    },
  },
  methods: { ...mapActions(sputnik, ["getItems"]) },
};
</script>
