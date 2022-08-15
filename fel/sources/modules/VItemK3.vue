<template>
  <slot
    :animate="animate"
    :class="class"
    :width="width"
    :height="height"
    :title="
      typeof this.title === 'string'
        ? this.title
        : this.title === undefined || !!this.title
        ? this.getTitle(this.theItem)
        : undefined
    "
    :subtitle="
      typeof this.date === 'string'
        ? this.date
        : (this.date === undefined || !!this.date) &&
          !isNaN(new Date(this.theItem.date || this.theItem.lastmod))
        ? new Date(
            this.theItem.date || this.theItem.lastmod
          ).toLocaleDateString()
        : undefined
    "
    :text="
      typeof this.description === 'string'
        ? this.description
        : this.description === undefined || !!this.description
        ? this.theItem.description
        : undefined
    "
    :icon="
      typeof this.icon === 'string'
        ? `mdi-${this.icon}`
        : this.icon === undefined || !!this.icon
        ? `mdi-${this.theItem.icon || 'open-in-new'}`
        : undefined
    "
    :image="
      typeof this.image === 'string'
        ? this.image
        : this.image === undefined || !!this.image
        ? this.theItem.image
        : undefined
    "
    :href="
      typeof this.href === 'string'
        ? this.href
        : this.href === undefined || !!this.href
        ? this.url
        : undefined
    "
  >
  </slot>
</template>
<script>
import { ref } from "vue";
import { mapState, mapActions } from "pinia";
import core from "../stores/core.js";
export default {
  props: {
    animate: String,
    class: String,
    width: Number,
    height: Number,
    title: String,
    icon: String,
    image: String,
    href: String,
    path: String,
    item: Object,
    date: String,
    description: String,
  },
  computed: {
    ...mapState(core, ["routePath"]),
    url() {
      const href = this.getPath(this.theItem);
      return href === this.routePath ? "" : href;
    },
    theItem() {
      return typeof this.item === "object"
        ? this.item
        : this.item === undefined || !!this.item
        ? this.getItems(null, null, null, null, this.path)[0]
        : undefined;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath", "getItems"]) },
};
</script>
