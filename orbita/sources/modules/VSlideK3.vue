<template>
  <v-slide-group show-arrows>
    <v-slide-group-item v-for="(item, i) in items" :key="i">
      <slot :item="item" :date="date" :description="description"></slot>
    </v-slide-group-item>
  </v-slide-group>
</template>
<script>
import { mapActions } from "pinia";
import sputnik from "~/sputnik.js";
export default {
  props: {
    date: { default: false, type: [Boolean, String] },
    description: { default: true, type: [Boolean, String] },
    deep: { default: undefined, type: Boolean },
    length: Number,
    reveal: { default: undefined, type: Boolean },
    sort: String,
    path: String,
    children: { default: undefined, type: Boolean },
    selector: { default: "*[@id]", type: String },
    axe: String,
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
        this.selector,
        this.axe
      );
    },
  },
  methods: { ...mapActions(sputnik, ["getItems"]) },
};
</script>
