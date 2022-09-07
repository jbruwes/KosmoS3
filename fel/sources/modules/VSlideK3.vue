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
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: { default: undefined, type: Boolean },
    attr: { default: "*[@id]", type: Boolean },
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
        this.attr,
      );
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
