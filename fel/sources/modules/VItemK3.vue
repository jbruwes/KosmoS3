<template>
  <v-card-k3
    :title="
      typeof title === 'string'
        ? title
        : theItem
        ? getTitle(theItem)
        : undefined
    "
    :subtitle="
      typeof date === 'string'
        ? date
        : theItem
        ? new Date(
            theItem.date ? theItem.date : theItem.lastmod
          ).toLocaleDateString()
        : undefined
    "
    :text="
      typeof description === 'string'
        ? description
        : theItem
        ? theItem.description
        : undefined
    "
    :icon="
      typeof icon === 'string'
        ? icon
        : theItem
        ? !!theItem.icon
          ? theItem.icon
          : undefined
        : undefined
    "
    :image="
      typeof image === 'string' ? image : theItem ? theItem.image : undefined
    "
    :href="typeof href === 'string' ? href : url"
  ></v-card-k3>
</template>
<script>
import { mapState, mapActions } from "pinia";
import core from "../stores/core.js";
import VCardK3 from "./VCardK3.vue";
export default {
  props: {
    path: String,
    item: Object,
    icon: String,
    date: String,
    title: String,
    image: String,
    href: String,
    description: String,
  },
  components: { VCardK3 },
  computed: {
    ...mapState(core, ["routePath"]),
    url() {
      const href = this.getPath(this.theItem);
      return href === this.routePath ? "" : href;
    },
    theItem() {
      return (
        this.item
          ? [this.item]
          : this.getItems(null, null, null, null, this.path)
      )[0];
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath", "getItems"]) },
};
</script>
