<template lang="pug">
v-row.fill-height(align="center", justify="center")
  v-card.pa-16.ma-16.text-white(
    v-animate-onscroll.repeat="animate",
    :href="href",
    :variant="variant",
    :color="color"
  )
    .text-center
      v-icon(
        :icon="icon",
        style="font-size: calc(var(--v-icon-size-multiplier) * 4em)"
      )
    v-card-item.justify-center.text-center
      div
        .text-h4.mb-1(v-if="title") {{ title }}
        div(v-if="date")
          v-chip(
            size="x-small",
            label,
            variant="outlined",
            prepend-icon="mdi-calendar",
            :text="date"
          )
    v-alert.text-center(
      v-if="description",
      :title="description",
      variant="text",
      prominent
    )
</template>
<script setup>
defineProps({
  color: { default: "#00000033", type: String },
  animate: { default: "animate__animated animate__bounceIn", type: String },
  title: { default: undefined, type: String },
  date: { default: undefined, type: String },
  description: { default: undefined, type: String },
  icon: { default: undefined, type: String },
  href: { default: undefined, type: String },
  variant: { default: undefined, type: String },
});
</script>
