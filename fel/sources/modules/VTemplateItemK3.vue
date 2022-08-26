<template>
  <v-list-item
    v-animate-onscroll.repeat="animate"
    :height="height"
    :width="width"
    :class="class"
    :href="href"
    :prepend-icon="icon"
    :title="title"
    :subtitle="text"
    :variant="variant"
    ><v-chip
      v-if="subtitle"
      size="x-small"
      label
      variant="outlined"
      prepend-icon="mdi-calendar"
      :text="subtitle"
      class="mr-1"
    ></v-chip>
  </v-list-item>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounce", type: String },
    class: String,
    width: Number,
    height: Number,
    title: String,
    subtitle: String,
    text: String,
    icon: String,
    href: String,
    variant: String,
  },
};
</script>
