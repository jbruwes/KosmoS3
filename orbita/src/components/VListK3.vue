<template>
  <v-list>
    <template v-for="item in items">
      <slot :item="item" :date="date" :description="description"></slot>
    </template>
  </v-list>
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
     * @returns {Array} Элементы списка
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
