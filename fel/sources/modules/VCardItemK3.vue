<template>
  <v-card-k3
    :animate="animate"
    :class="class"
    :width="width"
    :title="
      title
        ? title
        : JSON.parse(titleOff)
        ? undefined
        : item
        ? getTitle(item)
        : undefined
    "
    :subtitle="
      date
        ? date
        : JSON.parse(dateOff)
        ? undefined
        : item
        ? new Date(item.date ? item.date : item.lastmod).toLocaleDateString()
        : undefined
    "
    :text="
      description
        ? description
        : JSON.parse(descriptionOff)
        ? undefined
        : item
        ? item.description
        : undefined
    "
    :icon="icon ? icon : item ? `mdi-${item.icon}` : undefined"
    :image="
      image
        ? image
        : JSON.parse(imageOff)
        ? undefined
        : item
        ? item.image
        : undefined
    "
    :href="href ? href : JSON.parse(hrefOff) ? undefined : url"
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
  components: { VCardK3 },
  computed: {
    ...mapState(core, ["routePath"]),
    url() {
      let href = this.item ? this.getPath(this.item) : "";
      return href === this.routePath ? "" : href;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath"]) },
};
</script>
