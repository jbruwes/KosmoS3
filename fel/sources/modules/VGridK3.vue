<template>
  <v-container>
    <v-row justify="center">
      <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4" lg="3" xl="2">
        <slot
        :item="item"
        :animate="animate"
        :date="date"
        :variant="variant"
        :width="width"
        :height="height"
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
  computed: {
    items() {
      return this.getItems(
        this.deep,
        this.length,
        this.reveal,
        this.sort,
        this.path,
        this.children,
        "*[@id][string(@image)]"
      );
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
