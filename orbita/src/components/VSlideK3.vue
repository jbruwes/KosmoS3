<template lang="pug">
v-slide-group(show-arrows)
  v-slide-group-item(v-for="(item, i) in items", :key="i")
    slot(:item="item", :date="date", :description="description")
</template>
<script>
import { mapActions } from "pinia";
import orbita from "@/orbita";

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
     * @returns {Array} Слайды
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
  methods: { ...mapActions(orbita, ["getItems"]) },
};
</script>
