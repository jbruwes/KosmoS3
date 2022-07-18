<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      :width="width"
      :height="height"
      :class="class"
    >
      <v-img :src="image" :aspect-ratio="16 / 9" cover
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
      <v-card-title>{{ title }}</v-card-title>
      <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
      <v-card-text>{{ text }}</v-card-text>

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
  },
};
</script>
