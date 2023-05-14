<template lang="pug">
v-card(
  v-animate-onscroll.repeat="animate",
  :height="height",
  :width="width",
  :class="classes",
  :href="params.href",
  :variant="variant"
)
  .text-center
    v-icon(
      :icon="params.icon",
      style="font-size: calc(var(--v-icon-size-multiplier) * 4em)"
    )
  v-card-item.justify-center.text-center
    div
      .text-h6.mb-1(v-if="params.title") {{ params.title }}
      div(v-if="params.date")
        v-chip(
          size="x-small",
          label,
          variant="outlined",
          prepend-icon="mdi-calendar",
          :text="params.date"
        )
  v-card-text.text-center(v-if="params.description") {{ params.description }}
</template>
<script setup>
defineProps({
  animate: { default: "animate__animated animate__bounce", type: String },
  classes: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: "plain", type: String },
  params: { default: undefined, type: Object },
});
</script>
