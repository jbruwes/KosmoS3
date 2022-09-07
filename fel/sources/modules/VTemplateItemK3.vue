<template>
  <v-list-item
    v-animate-onscroll.repeat="animate"
    :height="height"
    :width="width"
    :class="class"
    :href="href"
    :prepend-icon="icon"
    :title="title"
    :subtitle="description"
    :variant="variant"
    ><v-chip
      v-if="date"
      size="x-small"
      label
      variant="outlined"
      prepend-icon="mdi-calendar"
      :text="date"
      class="mr-1"
    ></v-chip>
  </v-list-item>
</template>
<script>
export default {
  props: {
    animate: { default: "animate__animated animate__bounce", type: String },
    class: String,
    width: [String, Number],
    height: [String, Number],
    title: String,
    date: String,
    description: String,
    icon: String,
    href: String,
    variant: String,
  },
};
</script>
