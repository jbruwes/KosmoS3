<template lang="pug">
v-alert(
  v-animate-onscroll.repeat="animate",
  :icon="icon",
  :height="height",
  :width="width",
  :class="classes",
  :href="href",
  :variant="variant",
  :title="title",
  prominent
)
  v-chip.mr-1(
    v-if="date",
    size="x-small",
    label,
    variant="outlined",
    prepend-icon="mdi-calendar",
    :text="date"
  ) {{ description }}
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
