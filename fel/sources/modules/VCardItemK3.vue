<template>
  <v-card-k3
    :animate="animate"
    :title="
      JSON.parse(titleOff) ? undefined : item ? getTitle(item) : undefined
    "
    :subtitle="
      JSON.parse(dateOff)
        ? undefined
        : item
        ? new Date(item.date ? item.date : item.lastmod).toLocaleDateString()
        : undefined
    "
    :text="
      JSON.parse(descriptionOff)
        ? undefined
        : item
        ? item.description
        : undefined
    "
    :icon="item ? `mdi-${item.icon}` : 'mdi-open-in-new'"
    :image="JSON.parse(imageOff) ? undefined : item ? item.image : undefined"
    :href="JSON.parse(hrefOff) ? undefined : href"
  ></v-card-k3>
</template>
<script>
import { mapState, mapActions } from "pinia";
import core from "../stores/core.js";
import VCardK3 from "./VCardK3.vue";
export default {
  props: {
    item: Object,
    animate: String,
    dateOff: Boolean,
    titleOff: Boolean,
    imageOff: Boolean,
    hrefOff: Boolean,
    descriptionOff: Boolean,
  },
  components: { VCardK3 },
  computed: {
    ...mapState(core, ["routePath"]),
    href() {
      let href = this.item ? this.getPath(this.item) : "";
      return href === this.routePath ? "" : href;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath"]) },
};
</script>
