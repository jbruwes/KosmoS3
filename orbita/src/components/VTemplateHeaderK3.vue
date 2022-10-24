<template lang="pug">
v-alert(
  v-animate-onscroll.repeat="animate",
  :icon="params.icon",
  :height="height",
  :width="width",
  :class="classes",
  :href="params.href",
  :variant="variant",
  :title="params.title",
  prominent
)
  v-chip.mr-1(
    v-if="params.date",
    size="x-small",
    label,
    variant="outlined",
    prepend-icon="mdi-calendar",
    :text="params.date"
  )
  | {{ params.description }}
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
