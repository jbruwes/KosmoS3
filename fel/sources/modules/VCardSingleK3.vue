<template>
  <v-card-item-k3
    :item="item"
    :animate="animate"
    :class="class"
    :width="width"
    :icon="icon"
    :date="date"
    :dateOff="dateOff"
    :title="title"
    :titleOff="titleOff"
    :image="image"
    :imageOff="imageOff"
    :href="href"
    :hrefOff="hrefOff"
    :description="description"
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
    class: String,
    width: Number,
    icon: String,
    date: String,
    dateOff: Boolean,
    title: String,
    titleOff: Boolean,
    image: String,
    imageOff: Boolean,
    href: String,
    hrefOff: Boolean,
    description: String,
    descriptionOff: Boolean,
  },
  components: { VCardItemK3 },
  computed: {
    item() {
      const items = this.getItems(null, null, null, null, this.path);
      return items.length ? items[0] : undefined;
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
