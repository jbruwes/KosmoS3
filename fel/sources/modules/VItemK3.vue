<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      :elevation="isHovering && type === 'card' ? 12 : undefined"
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      :width="width"
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
      return this.variant || (this.type === "icon" ? "plain" : "elevated");
    },
    theItem() {
      return this.item || this.getItems(null, null, null, null, this.path)[0];
    },
    theIcon() {
      return this.icon || this.theItem.icon || "open-in-new";
    },
    theHref() {
      return this.href || this.url;
    },
    theImage() {
      return this.image || this.theItem.image;
    },
    theTitle() {
      return this.title || this.getTitle(this.theItem);
    },
    theSubtitle() {
      const date = new Date(this.theItem.date || this.theItem.lastmod);
      return this.date || (isNaN(date) ? "" : date.toLocaleDateString());
    },
    theText() {
      return this.description || this.theItem.description;
    },
  },
  methods: { ...mapActions(core, ["getTitle", "getPath", "getItems"]) },
};
</script>
