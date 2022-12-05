<template lang="pug">
v-row.h-100(align="center", justify="center")
  v-card.pa-16.ma-16.text-white(
    v-animate-onscroll.repeat="animate",
    :href="params.href",
    :variant="variant",
    :color="color"
  )
    .text-center
      v-icon(
        :icon="params.icon",
        style="font-size: calc(var(--v-icon-size-multiplier) * 4em)"
      )
    v-card-item.justify-center.text-center
      div
        .text-h4.mb-1(v-if="params.title") {{ params.title }}
        div(v-if="params.date")
          v-chip(
            size="x-small",
            label,
            variant="outlined",
            prepend-icon="mdi-calendar",
            :text="params.date"
          )
    v-alert.text-center(
      v-if="params.description",
      :title="params.description",
      variant="text",
      prominent
    )
</template>
<script setup>
defineProps({
  color: { default: "#00000033", type: String },
  animate: { default: "animate__animated animate__bounceIn", type: String },
  variant: { default: undefined, type: String },
  params: { default: undefined, type: Object },
});
</script>
