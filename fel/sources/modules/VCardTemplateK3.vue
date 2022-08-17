<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      :height="height"
      :width="width"
      :elevation="isHovering ? 6 : undefined"
      :class="class"
      :href="href"
    >
      <v-img :src="image" :aspect-ratio="16 / 9" cover
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
              :icon="icon"
              :href="href"
            ></v-btn></div></v-expand-transition
      ></v-img>
      <v-card-item density="compact" :title="title"
        ><v-card-subtitle v-if="subtitle"
          ><v-chip
            size="x-small"
            label
            variant="outlined"
            prepend-icon="mdi-calendar"
            :text="subtitle"
          ></v-chip></v-card-subtitle
      ></v-card-item>
      <v-card-text v-if="text">{{ text }}</v-card-text>
    </v-card>
  </v-hover>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__fadeIn", type: String },
    class: String,
    width: Number,
    height: Number,
    title: String,
    subtitle: String,
    text: String,
    icon: String,
    image: String,
    href: String,
  },
};
</script>
