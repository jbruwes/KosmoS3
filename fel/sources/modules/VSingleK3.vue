<template>
  <slot
    :animate="animate"
    :class="class"
    :width="width"
    :height="height"
    :variant="variant"
    :title="
      typeof this.title === 'string'
        ? this.title
        : this.title
        ? this.getTitle(this.theItem)
        : undefined
    "
    :subtitle="
      typeof this.date === 'string'
        ? this.date
        : this.date &&
          !isNaN(new Date(this.theItem.date || this.theItem.lastmod))
        ? new Date(
            this.theItem.date || this.theItem.lastmod
          ).toLocaleDateString()
        : undefined
    "
    :text="
      typeof this.description === 'string'
        ? this.description
        : this.description
        ? this.theItem.description
        : undefined
    "
    :icon="
      typeof this.icon === 'string'
        ? `mdi-${this.icon}`
        : this.icon
        ? `mdi-${this.theItem.icon || 'open-in-new'}`
        : undefined
    "
    :image="
      typeof this.image === 'string'
        ? this.image
        : this.image
        ? this.theItem.image
        : undefined
    "
    :href="
      typeof this.href === 'string'
        ? this.href
        : this.href
        ? this.url
        : undefined
    "
  >
  </slot>
</template>
<script>
import { ref } from "vue";
import { mapState, mapActions } from "pinia";
import core from "+/core.js";
export default {
  props: {
    animate: String,
    class: String,
    width: Number,
    height: Number,
    variant: String,
    title: { default: true, type: String },
    icon: { default: true, type: String },
    image: { default: true, type: String },
    href: { default: true, type: String },
    path: String,
    item: { default: true, type: Object },
    date: { default: true, type: String },
    description: { default: true, type: String },
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
        : this.item
        ? this.getItems(null, null, null, null, this.path)[0]
        : undefined;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath", "getItems"]) },
};
</script>
