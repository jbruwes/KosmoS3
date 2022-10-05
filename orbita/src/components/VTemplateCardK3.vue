<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      :height="height"
      :width="width"
      :elevation="isHovering ? 6 : undefined"
      :class="classes"
      :href="href"
      :variant="variant"
    >
      <v-img :src="image" :aspect-ratio="4 / 3" cover
        ><v-expand-transition
          ><div
            v-if="isHovering"
            class="d-flex transition-fast-in-slow-out bg-white align-center justify-center position-absolute w-100"
            style="height: 100%; bottom: 0; opacity: 0.9"
          >
            <v-btn
              variant="outlined"
              size="x-large"
              color="grey"
              :icon="icon"
              :href="href"
            ></v-btn></div></v-expand-transition
      ></v-img>
      <v-card-item>
        <div>
          <div v-if="date" class="mb-1">
            <v-chip
              size="x-small"
              label
              variant="outlined"
              prepend-icon="mdi-calendar"
              :text="date"
            ></v-chip>
          </div>
          <div v-if="title" class="text-subtitle-1">
            {{ title }}
          </div>
        </div>
      </v-card-item>
      <v-card-text v-if="description" class="text-caption">{{
        description
      }}</v-card-text>
    </v-card>
  </v-hover>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounceIn", type: String },
    classes: { default: undefined, type: String },
    width: { default: undefined, type: [String, Number] },
    height: { default: undefined, type: [String, Number] },
    title: { default: undefined, type: String },
    date: { default: undefined, type: String },
    description: { default: undefined, type: String },
    icon: { default: undefined, type: String },
    image: { default: undefined, type: String },
    href: { default: undefined, type: String },
    variant: { default: undefined, type: String },
  },
};
</script>
