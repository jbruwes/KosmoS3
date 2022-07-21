<template>
  <v-card-k3
    :title="
      typeof title === 'string' ? title : item ? getTitle(item) : undefined
    "
    :text="
      typeof date === 'string'
        ? date
        : item
        ? new Date(item.date ? item.date : item.lastmod).toLocaleDateString()
        : undefined
    "
    :subtitle="
      typeof description === 'string'
        ? description
        : item
        ? item.description
        : undefined
    "
    :icon="
      typeof icon === 'string'
        ? icon
        : item
        ? !!item.icon
          ? item.icon
          : undefined
        : undefined
    "
    :image="typeof image === 'string' ? image : item ? item.image : undefined"
    :href="typeof href === 'string' ? href : url"
  ></v-card-k3>
</template>
<script>
import { mapState, mapActions } from "pinia";
import core from "../stores/core.js";
import VCardK3 from "./VCardK3.vue";
export default {
  props: {
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
      const href = this.getPath(this.item);
      return href === this.routePath ? "" : href;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath"]) },
};
</script>
