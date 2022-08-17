<template>
  <v-container>
    <v-row justify="center">
      <v-col v-for="item in items" cols="12" sm="6" md="4" lg="3" xl="2">
        <slot :item="item" :animate="animate"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VItemK3 from "./VItemK3.vue";
export default {
  props: {
    animate: String,
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: Boolean,
  },
  components: { VItemK3 },
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
