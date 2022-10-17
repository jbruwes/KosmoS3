<template lang="pug">
slot(
  :title="typeof title === 'string' ? title : title ? getTitle(theItem) : undefined",
  :date="typeof date === 'string' ? date : date && !isNaN(new Date(theItem.date || theItem.lastmod)) ? new Date(theItem.date || theItem.lastmod).toLocaleDateString() : undefined",
  :description="typeof description === 'string' ? description : description ? theItem.description : undefined",
  :icon="typeof icon === 'string' ? `mdi-${icon}` : icon ? `mdi-${theItem.icon || 'open-in-new'}` : undefined",
  :image="typeof image === 'string' ? image : image ? theItem.image : undefined",
  :href="typeof href === 'string' ? href : href ? url : undefined"
)
</template>
<script>
import { mapState, mapActions } from "pinia";
import orbita from "@/orbita";

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
    ...mapState(orbita, ["routePath"]),
    /**
     * @returns {string} Вычесленный урл
     */
    url() {
      const href = this.getHref(this.theItem);
      return href === this.routePath ? "" : href;
    },
    /**
     * @returns {object} Текущий объект
     */
    theItem() {
      if (typeof this.item === "object") return this.item;
      return this.item
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
  methods: { ...mapActions(orbita, ["getTitle", "getHref", "getItems"]) },
};
</script>
