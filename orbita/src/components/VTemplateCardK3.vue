<template lang="pug">
v-hover(v-slot="{ isHovering, props }")
  v-card(
    v-animate-onscroll.repeat="animate",
    v-bind="props",
    :height="height",
    :width="width",
    :elevation="isHovering ? 6 : undefined",
    :class="classes",
    :href="params.href",
    :variant="variant"
  )
    v-img(:src="params.image", :aspect-ratio="4 / 3", cover)
      v-expand-transition
        .d-flex.transition-fast-in-slow-out.bg-white.align-center.justify-center.position-absolute.w-100(
          v-if="isHovering",
          style="height: 100%; bottom: 0; opacity: 0.9"
        )
          v-btn(
            variant="outlined",
            size="x-large",
            color="grey",
            :icon="params.icon",
            :href="params.href"
          )
    v-card-item
      div
        .mb-1(v-if="params.date")
          v-chip(
            size="x-small",
            label,
            variant="outlined",
            prepend-icon="mdi-calendar",
            :text="params.date"
          )
        .text-subtitle-1(v-if="params.title") {{ params.title }}
    v-card-text.text-caption(v-if="params.description") {{ params.description }}
</template>
<script setup>
defineProps({
  animate: { default: "animate__animated animate__bounceIn", type: String },
  classes: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
  params: { default: undefined, type: Object },
});
</script>
