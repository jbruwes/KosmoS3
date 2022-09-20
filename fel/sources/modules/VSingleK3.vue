<template>
  <slot
    :title="
      typeof this.title === 'string'
        ? this.title
        : this.title
        ? this.getTitle(this.theItem)
        : undefined
    "
    :date="
      typeof this.date === 'string'
        ? this.date
        : this.date &&
          !isNaN(new Date(this.theItem.date || this.theItem.lastmod))
        ? new Date(
            this.theItem.date || this.theItem.lastmod
          ).toLocaleDateString()
        : undefined
    "
    :description="
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
import { mapState, mapActions } from "pinia";
import core from "~/core.js";
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
    length: { default: undefined, type: Number },
    reveal: { default: undefined, type: Boolean },
    sort: { default: undefined, type: String },
    path: { default: undefined, type: String },
    children: { default: undefined, type: Boolean },
    selector: { default: undefined, type: String },
    axe: { default: undefined, type: String },
  },
  computed: {
    ...mapState(core, ["routePath"]),
    url() {
      const href = this.getHref(this.theItem);
      return href === this.routePath ? "" : href;
    },
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
  methods: { ...mapActions(core, ["getTitle", "getHref", "getItems"]) },
};
</script>
