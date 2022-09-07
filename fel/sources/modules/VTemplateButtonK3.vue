<template>
  <v-btn
    class="text-none"
    :variant="variant"
    v-animate-onscroll.repeat="animate"
    :height="height"
    :width="width"
    :class="class"
    :href="href"
    :prepend-icon="icon"
  >{{ title }}</v-btn>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounce", type: String },
    class: String,
    width: [String, Number],
    height: [String, Number],
    title: String,
    icon: String,
    href: String,
    variant: { default: "flat", type: String },
  },
};
</script>
