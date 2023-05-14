<template lang="pug">
v-btn.text-none(
  v-animate-onscroll.repeat="animate",
  :variant="variant",
  :height="height",
  :width="width",
  :class="classes",
  :href="params.href",
  :prepend-icon="params.icon"
) {{ params.title }}
</template>
<script setup>
defineProps({
  animate: { default: "animate__animated animate__bounce", type: String },
  classes: { default: undefined, type: String },
  width: { default: undefined, type: [String, Number] },
  height: { default: undefined, type: [String, Number] },
  variant: { default: "flat", type: String },
  params: { default: undefined, type: Object },
});
</script>
