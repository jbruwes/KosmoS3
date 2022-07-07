<template>
  <v-slide-group show-arrows class="pa-4">
    <v-slide-group-item v-for="item in items" :key="item">
      <v-card-item-k3
        :item="item"
        :animate="animate"
        :dateOff="dateOff"
        :titleOff="titleOff"
        :imageOff="imageOff"
        :hrefOff="hrefOff"
        :descriptionOff="descriptionOff"
        class="md-4"
      ></v-card-item-k3>
    </v-slide-group-item>
  </v-slide-group>
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
    items() {
      return this.getItems(null, null, null, null, this.path, null, "*");
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
