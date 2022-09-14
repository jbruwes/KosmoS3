<template>
  <v-list>
    <template v-for="item in items">
      <slot
        :item="item"
        :animate="animate"
        :date="date"
        :variant="variant"
        :width="width"
        :height="height"
        :description="description"
      ></slot>
    </template>
  </v-list>
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
        this.xpath,
        this.axe,
      );
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
