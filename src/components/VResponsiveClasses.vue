<template lang="pug">
v-container.h-100(fluid)
</template>

<script setup>
defineProps({
  lang: { default: "html", type: String },
  modelValue: { default: "", type: String },
});
</script>
