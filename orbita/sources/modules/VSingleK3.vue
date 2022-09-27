<template>
  <slot
    :title="
      typeof title === 'string' ? title : title ? getTitle(theItem) : undefined
    "
    :date="
      typeof date === 'string'
        ? date
        : date && !isNaN(new Date(theItem.date || theItem.lastmod))
        ? new Date(theItem.date || theItem.lastmod).toLocaleDateString()
        : undefined
    "
    :description="
      typeof description === 'string'
        ? description
        : description
        ? theItem.description
        : undefined
    "
    :icon="
      typeof icon === 'string'
        ? `mdi-${icon}`
        : icon
        ? `mdi-${theItem.icon || 'open-in-new'}`
        : undefined
    "
    :image="
      typeof image === 'string' ? image : image ? theItem.image : undefined
    "
    :href="typeof href === 'string' ? href : href ? url : undefined"
  >
  </slot>
</template>
<script>
import { mapState, mapActions } from "pinia";
import sputnik from "~/sputnik.js";

export default {
  props: {
    title: { default: true, type: [Boolean, String] },
    icon: { default: true, type: [Boolean, String] },
    image: { default: true, type: [Boolean, String] },
    href: { default: true, type: [Boolean, String] },
    item: { default: true, type: [Boolean, Object] },
    date: { default: false, type: [Boolean, String] },
    description: { default: true, type: [Boolean, String] },
    deep: { default: undefined, type: Boolean },
    length: Number,
    reveal: { default: undefined, type: Boolean },
    sort: String,
    path: String,
    children: { default: undefined, type: Boolean },
    selector: String,
    axe: String,
  },
  computed: {
    ...mapState(sputnik, ["routePath"]),
    /**
     *
     */
    url() {
      const href = this.getHref(this.theItem);
      return href === this.routePath ? "" : href;
    },
    /**
     *
     */
    theItem() {
      return typeof this.item === "object"
        ? this.item
        : this.item
        ? this.getItems(
            this.deep,
            this.length,
            this.reveal,
            this.sort,
            this.path,
            this.children,
            this.selector,
            this.axe
          )[0] || {}
        : {};
    },
  },
  methods: { ...mapActions(sputnik, ["getTitle", "getHref", "getItems"]) },
};
</script>
