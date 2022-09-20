<template>
  <v-container>
    <v-row justify="center">
      <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4" lg="3">
        <slot
          :item="item"
          :date="date"
          :description="description"
        ></slot>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "pinia";
import core from "~/core.js";
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
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
