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
    classes: { default: undefined, type: String },
    width: { default: undefined, type: [String, Number] },
    height: { default: undefined, type: [String, Number] },
    title: { default: undefined, type: String },
    icon: { default: undefined, type: String },
    href: { default: undefined, type: String },
    variant: { default: "flat", type: String },
  },
};
</script>
