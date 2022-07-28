<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      :elevation="isHovering ? 12 : 2"
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      :width="width"
      :height="height"
      :class="class"
      :href="theHref"
      :variant="variants"
    >
      <v-img v-if="type === 'card'" :src="theImage" :aspect-ratio="16 / 9" cover
        ><v-expand-transition
          ><div
            v-if="isHovering"
            class="d-flex transition-fast-in-slow-out bg-white align-center justify-center position-absolute w-100"
            style="height:100%;bottom:0;opacity:.9;"
          >
            <v-btn
              variant="outlined"
              size="x-large"
              color="grey"
              :icon="`mdi-${theIcon}`"
              :href="theHref"
            ></v-btn></div></v-expand-transition
      ></v-img>
      <div v-if="type === 'icon'" class="text-center ma-2">
        <v-icon
          :icon="`mdi-${theIcon}`"
          style="font-size: calc(var(--v-icon-size-multiplier) * 4em);"
        ></v-icon>
      </div>

      <v-card-item :title="theTitle"
        ><v-card-subtitle v-if="theSubtitle"
          ><v-chip
            size="x-small"
            label
            variant="outlined"
            prepend-icon="mdi-calendar"
            :text="theSubtitle"
          ></v-chip></v-card-subtitle
      ></v-card-item>
      <v-card-text v-if="theText">{{ theText }}</v-card-text>
      <!--v-overlay
        :model-value="isHovering"
        contained
        class="align-center justify-center"
      >
        <v-btn
          variant="outlined"
          size="x-large"
          color="white"
          :icon="`mdi-${icon}`"
          :href="href"
        ></v-btn>
      </v-overlay-->
    </v-card>
  </v-hover>
</template>
<script>
import { mapState, mapActions } from "pinia";
import core from "../stores/core.js";
export default {
  props: {
    animate: { default: "animate__animated animate__flipInY", type: String },
    class: String,
    width: { default: 275.99, type: Number },
    height: Number,
    title: String,
    subtitle: String,
    text: String,
    icon: String,
    image: String,
    href: String,
    type: { default: "card", type: String },
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
    theVariant() {
      let variant = this.variant;
      if (!variant)
        switch (this.type) {
          case "icon":
            variant = "plain";
            break;
          default:
            variant = "elevated";
            break;
        }
      return variant;
    },
    theItem() {
      return (
        this.item
          ? [this.item]
          : this.getItems(null, null, null, null, this.path)
      )[0];
    },
    theIcon() {
      return typeof this.icon === "string"
        ? this.icon
        : this.theItem
        ? !!this.theItem.icon
          ? this.theItem.icon
          : "open-in-new"
        : "open-in-new";
    },
    theHref() {
      return typeof this.href === "string" ? this.href : this.url;
    },
    theImage() {
      return typeof this.image === "string"
        ? this.image
        : this.theItem
        ? this.theItem.image
        : undefined;
    },
    theTitle() {
      return typeof this.title === "string"
        ? this.title
        : this.theItem
        ? this.getTitle(this.theItem)
        : undefined;
    },
    theSubtitle() {
      return typeof this.date === "string"
        ? this.date
        : this.theItem
        ? new Date(
            this.theItem.date ? this.theItem.date : this.theItem.lastmod
          ).toLocaleDateString()
        : undefined;
    },
    theText() {
      return typeof this.description === "string"
        ? this.description
        : this.theItem
        ? this.theItem.description
        : undefined;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath", "getItems"]) },
};
</script>
