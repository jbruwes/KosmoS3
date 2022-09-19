<template>
  <v-slide-group show-arrows>
    <v-slide-group-item v-for="(item, i) in items" :key="i">
      <slot
        :item="item"
        :animate="animate"
        :date="date"
        :variant="variant"
        :width="width"
        :height="height"
        :description="description"
      ></slot>
    </v-slide-group-item>
  </v-slide-group>
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
    width: { default: 320, type: [String, Number] },
    deep: { default: undefined, type: Boolean },
    length: { default: undefined, type: Number },
    reveal: { default: undefined, type: Boolean },
    sort: { default: undefined, type: String },
    path: { default: undefined, type: String },
    children: { default: undefined, type: Boolean },
    xpath: { default: "*[@id]", type: String },
    axe: { default: undefined, type: String },
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
        this.axe,
      );
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
