<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      class="ma-auto"
      :height="height"
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
    <!--v-hover v-slot="{ isHovering, props }">
    <v-card
      v-animate-onscroll.repeat="animate"
      v-bind="props"
      class="ma-auto"
      :height="height"
      :elevation="isHovering && type === 'card' ? 6 : undefined"
      density="compact"
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
  </v-hover-->
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__fadeIn", type: String },
    class: String,
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
