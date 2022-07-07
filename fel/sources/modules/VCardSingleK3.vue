<template>
  <v-card-item-k3
    :item="item"
    :animate="animate"
    :dateOff="dateOff"
    :titleOff="titleOff"
    :imageOff="imageOff"
    :hrefOff="hrefOff"
    :descriptionOff="descriptionOff"
  ></v-card-item-k3>
</template>
<script>
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VCardItemK3 from "./VCardItemK3.vue";
export default {
  props: {
    path: String,
    animate: String,
    dateOff: Boolean,
    titleOff: Boolean,
    imageOff: Boolean,
    hrefOff: Boolean,
    descriptionOff: Boolean,
  },
  components: { VCardItemK3 },
  computed: {
    item() {
      const items = this.getItems(
        null,
        null,
        null,
        null,
        this.path ? [this.path] : undefined
      );
      return items.length ? items[0] : undefined;
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
