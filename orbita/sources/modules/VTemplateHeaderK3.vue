<template>
  <v-alert
    v-animate-onscroll.repeat="animate"
    :icon="icon"
    :height="height"
    :width="width"
    :class="classes"
    :href="href"
    :variant="variant"
    :title="title"
    prominent
    ><v-chip
      v-if="date"
      size="x-small"
      class="mr-1"
      label
      variant="outlined"
      prepend-icon="mdi-calendar"
      :text="date"
    ></v-chip
    >{{ description }}</v-alert
  >
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounce", type: String },
    classes: String,
    width: [String, Number],
    height: [String, Number],
    title: String,
    date: String,
    description: String,
    icon: String,
    href: String,
    variant: { default: "plain", type: String },
  },
};
</script>
