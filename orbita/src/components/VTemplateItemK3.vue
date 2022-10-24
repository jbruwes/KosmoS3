<template lang="pug">
v-list-item(
  v-animate-onscroll.repeat="animate",
  :height="height",
  :width="width",
  :class="classes",
  :href="params.href",
  :prepend-icon="params.icon",
  :title="params.title",
  :subtitle="params.description",
  :variant="variant"
)
  v-chip.mr-1(
    v-if="params.date",
    size="x-small",
    label,
    variant="outlined",
    prepend-icon="mdi-calendar",
    :text="params.date"
  )
</template>
<script setup>
defineProps({
  animate: { default: "animate__animated animate__bounce", type: String },
  classes: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: undefined, type: String },
  params: { default: undefined, type: Object },
});
</script>
