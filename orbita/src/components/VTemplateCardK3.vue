<template lang="pug">
v-hover(v-slot="{ isHovering, props }")
  v-card(
    v-animate-onscroll.repeat="animate",
    v-bind="props",
    :height="height",
    :width="width",
    :elevation="isHovering ? 6 : undefined",
    :class="classes",
    :href="href",
    :variant="variant"
  )
    v-img(:src="image", :aspect-ratio="4 / 3", cover)
      v-expand-transition
        .d-flex.transition-fast-in-slow-out.bg-white.align-center.justify-center.position-absolute.w-100(
          v-if="isHovering",
          style="height: 100%; bottom: 0; opacity: 0.9"
        )
          v-btn(
            variant="outlined",
            size="x-large",
            color="grey",
            :icon="icon",
            :href="href"
          )
    v-card-item
      div
        .mb-1(v-if="date")
          v-chip(
            size="x-small",
            label,
            variant="outlined",
            prepend-icon="mdi-calendar",
            :text="date"
          )
        .text-subtitle-1(v-if="title") {{ title }}
    v-card-text.text-caption(v-if="description") {{ description }}
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
