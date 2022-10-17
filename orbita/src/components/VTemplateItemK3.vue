<template lang="pug">
v-list-item(
  v-animate-onscroll.repeat="animate",
  :height="height",
  :width="width",
  :class="classes",
  :href="href",
  :prepend-icon="icon",
  :title="title",
  :subtitle="description",
  :variant="variant"
)
  v-chip.mr-1(
    v-if="date",
    size="x-small",
    label,
    variant="outlined",
    prepend-icon="mdi-calendar",
    :text="date"
  )
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounce", type: String },
    classes: { default: undefined, type: String },
    width: { default: undefined, type: [String, Number] },
    height: { default: undefined, type: [String, Number] },
    title: { default: undefined, type: String },
    date: { default: undefined, type: String },
    description: { default: undefined, type: String },
    icon: { default: undefined, type: String },
    href: { default: undefined, type: String },
    variant: { default: undefined, type: String },
  },
};
</script>
