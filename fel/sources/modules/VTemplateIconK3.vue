<template>
  <v-card
    v-animate-onscroll.repeat="animate"
    :height="height"
    :width="width"
    :class="classes"
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
      ><v-card-subtitle v-if="date"
        ><v-chip
          size="x-small"
          label
          variant="outlined"
          prepend-icon="mdi-calendar"
          :text="date"
        ></v-chip></v-card-subtitle
    ></v-card-item>
    <v-card-text v-if="description" class="text-center">{{ description }}</v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounce", type: String },
    classes: String,
    width: Number,
    height: Number,
    title: String,
    date: String,
    description: String,
    icon: String,
    href: String,
    variant: { default: "plain", type: String },
  },
};
</script>
