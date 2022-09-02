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
    date: String,
    variant: String,
    height: Number,
    width: Number,
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: Boolean,
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
