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
      <v-card-item>
        <div>
          <div class="text-h6 mb-1" v-if="title">
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
      <v-card-text v-if="description">{{ description }}</v-card-text>
    </v-card>
  </v-hover>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounceIn", type: String },
    classes: String,
    width: Number,
    height: Number,
    title: String,
    date: String,
    description: String,
    icon: String,
    image: String,
    href: String,
    variant: String,
  },
};
</script>
