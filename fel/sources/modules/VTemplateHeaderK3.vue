<template>
  <v-alert
    :icon="icon"
    v-animate-onscroll.repeat="animate"
    :height="height"
    :width="width"
    :class="classes"
    :href="href"
    :variant="variant"
    :title="title"
    prominent
    ><v-chip
      v-if="subtitle"
      size="x-small"
      class="mr-1"
      label
      variant="outlined"
      prepend-icon="mdi-calendar"
      :text="subtitle"
    ></v-chip
    >{{ text }}</v-alert
  >
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounce", type: String },
    classes: String,
    width: Number,
    height: Number,
    title: String,
    subtitle: String,
    text: String,
    icon: String,
    href: String,
    variant: { default: "plain", type: String },
  },
};
</script>
