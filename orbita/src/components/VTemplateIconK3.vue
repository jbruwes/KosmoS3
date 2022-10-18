<template lang="pug">
v-card(
  v-animate-onscroll.repeat="animate",
  :height="height",
  :width="width",
  :class="classes",
  :href="href",
  :variant="variant"
)
  .text-center
    v-icon(
      :icon="icon",
      style="font-size: calc(var(--v-icon-size-multiplier) * 4em)"
    )
  v-card-item.justify-center.text-center
    div
      .text-h6.mb-1(v-if="title") {{ title }}
      div(v-if="date")
        v-chip(
          size="x-small",
          label,
          variant="outlined",
          prepend-icon="mdi-calendar",
          :text="date"
        )
  v-card-text.text-center(v-if="description") {{ description }}
</template>
<script setup>
defineProps({
  animate: { default: "animate__animated animate__bounce", type: String },
  classes: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  title: { default: undefined, type: String },
  date: { default: undefined, type: String },
  description: { default: undefined, type: String },
  icon: { default: undefined, type: String },
  href: { default: undefined, type: String },
  variant: { default: "plain", type: String },
});
</script>
