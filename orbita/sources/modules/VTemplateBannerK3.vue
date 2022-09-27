<template>
  <v-row class="fill-height" align="center" justify="center">
    <v-card
      v-animate-onscroll.repeat="animate"
      class="pa-16 ma-16 text-white"
      :href="href"
      :variant="variant"
      :color="innerColor"
    >
      <div class="text-center">
        <v-icon
          :icon="icon"
          style="font-size: calc(var(--v-icon-size-multiplier) * 4em)"
        ></v-icon>
      </div>
      <v-card-item class="justify-center text-center">
        <div>
          <div v-if="title" class="text-h4 mb-1">
            {{ title }}
          </div>
          <div v-if="date">
            <v-chip
              size="x-small"
              label
              variant="outlined"
              prepend-icon="mdi-calendar"
              :text="date"
            ></v-chip>
          </div>
        </div>
      </v-card-item>
      <v-alert
        v-if="description"
        :title="description"
        variant="text"
        prominent
        class="text-center"
      ></v-alert>
    </v-card>
  </v-row>
</template>
<script>
export default {
  props: {
    innerColor: { default: "#00000033", type: String },
    animate: { default: "animate__animated animate__bounceIn", type: String },
    title: String,
    date: String,
    description: String,
    icon: String,
    href: String,
    variant: String,
  },
};
</script>
