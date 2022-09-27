<template>
  <v-btn
    v-animate-onscroll.repeat="animate"
    class="text-none"
    :variant="variant"
    :height="height"
    :width="width"
    :class="classes"
    :href="href"
    :prepend-icon="icon"
    >{{ title }}</v-btn
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
    icon: String,
    href: String,
    variant: { default: "flat", type: String },
  },
};
</script>
