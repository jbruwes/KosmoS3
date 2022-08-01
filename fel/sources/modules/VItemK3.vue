<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      :elevation="isHovering && type === 'card' ? 6 : undefined"
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      density="compact"
      :width="theWidth"
      :height="height"
      :class="class"
      :href="theHref"
      :variant="theVariant"
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
      <div v-if="type === 'icon'" class="text-center">
        <v-icon
          :icon="`mdi-${theIcon}`"
          style="font-size: calc(var(--v-icon-size-multiplier) * 4em);"
        ></v-icon>
      </div>
      <v-card-item
        density="compact"
        :title="theTitle"
        :class="type === 'icon' ? 'justify-center text-center' : ''"
        ><v-card-subtitle v-if="theSubtitle"
          ><v-chip
            size="x-small"
            label
            variant="outlined"
            prepend-icon="mdi-calendar"
            :text="theSubtitle"
          ></v-chip></v-card-subtitle
      ></v-card-item>
      <v-card-text
        v-if="theText"
        :class="type === 'icon' ? 'text-center' : ''"
        >{{ theText }}</v-card-text
      >
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
    //width: { default: 275.99, type: Number },
    width: Number,
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
      return typeof this.variant === "string"
        ? this.variant
        : this.type === "icon"
        ? "plain"
        : "elevated";
    },
    theItem() {
      return typeof this.item === "object"
        ? this.item
        : this.getItems(null, null, null, null, this.path)[0];
    },
    theIcon() {
      return typeof this.icon === "string"
        ? this.icon
        : this.theItem.icon || "open-in-new";
    },
    theHref() {
      return typeof this.href === "string" ? this.href : this.url;
    },
    theImage() {
      return typeof this.image === "string" ? this.image : this.theItem.image;
    },
    theTitle() {
      return typeof this.title === "string"
        ? this.title
        : this.getTitle(this.theItem);
    },
    theSubtitle() {
      const date = new Date(this.theItem.date || this.theItem.lastmod);
      return typeof this.date === "string"
        ? this.date
        : isNaN(date)
        ? undefined
        : date.toLocaleDateString();
    },
    theText() {
      return typeof this.description === "string"
        ? this.description
        : this.theItem.description;
    },
    theWidth() {
      return typeof this.width !== "boolean"
        ? this.width
        : (this.height * 9) / 16;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath", "getItems"]) },
};
</script>
