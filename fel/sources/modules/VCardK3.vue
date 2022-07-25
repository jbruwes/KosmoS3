<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      :width="width"
      :height="height"
      :class="class"
      :href="href"
      :variant="variants"
    >
      <v-img v-if="type === 'image'" :src="image" :aspect-ratio="16 / 9" cover
        ><v-expand-transition
          ><div
            v-if="isHovering"
            class="d-flex transition-fast-in-fast-out align-center justify-center v-overlay__scrim v-overlay--absolute fill-height"
          >
            <v-btn
              variant="outlined"
              size="x-large"
              color="white"
              :icon="`mdi-${icon}`"
              :href="href"
            ></v-btn></div></v-expand-transition
      ></v-img>
      <div v-if="type === 'icon'" class="text-center ma-2">
        <v-icon
          :icon="`mdi-${icon}`"
          style="font-size: calc(var(--v-icon-size-multiplier) * 4em);"
        ></v-icon>
      </div>

      <v-card-item
        :title="title"
        :subtitle="subtitle"
        :prependIcon="type === 'icon' ? '' : `mdi-${icon}`"
      ></v-card-item>
      <v-card-text v-if="text">{{ text }}</v-card-text>
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
export default {
  props: {
    animate: { default: "animate__animated animate__flipInY", type: String },
    class: String,
    width: { default: 275.99, type: Number },
    height: Number,
    title: String,
    subtitle: String,
    text: String,
    icon: { default: "open-in-new", type: String },
    image: String,
    href: String,
    type: { default: "image", type: String },
  },
  computed: {
    variants() {
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
  },
};
</script>
