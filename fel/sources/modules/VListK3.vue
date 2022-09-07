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
import VSingleK3 from "./VSingleK3.vue";
export default {
  props: {
    animate: String,
    date: [Boolean, String],
    description: [Boolean, String],
    variant: String,
    height: [String, Number],
    width: [String, Number],
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: { default: undefined, type: Boolean },
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
