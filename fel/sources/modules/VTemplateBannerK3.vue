<template>
  <v-parallax
    height="100%"
    tile
    :src="image"
    cover
    v-animate-onscroll.repeat="animate"
    :aspect-ratio="16 / 9"
  >
    <v-row class="fill-height" align="center" justify="center">
      <v-card
        class="pa-16 ma-16 text-white"
        :height="height"
        :width="width"
        :href="href"
        :variant="variant"
      >
        <div class="text-center">
          <v-icon
            :icon="icon"
            style="font-size: calc(var(--v-icon-size-multiplier) * 4em);"
          ></v-icon>
        </div>
        <v-card-item :title="title" class="justify-center text-center"
          ><v-card-subtitle v-if="subtitle"
            ><v-chip
              size="x-small"
              label
              variant="outlined"
              prepend-icon="mdi-calendar"
              :text="subtitle"
            ></v-chip></v-card-subtitle
        ></v-card-item>
        <v-card-text v-if="text" class="text-center">{{ text }}</v-card-text>
      </v-card>
    </v-row>
  </v-parallax>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__fadeIn", type: String },
    width: Number,
    height: Number,
    title: String,
    subtitle: String,
    text: String,
    image: String,
    icon: String,
    href: String,
    variant: { default: "tonal", type: String },
  },
};
</script>
