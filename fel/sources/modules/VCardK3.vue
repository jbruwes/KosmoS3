<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-animate-onscroll.repeat="
        animate ? animate : 'animate__animated animate__flipInY'
      "
      v-bind="props"
      width="290px"
    >
      <v-img :src="image"></v-img>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
      <v-card-text>{{ text }}</v-card-text>
      <v-overlay
        :model-value="isHovering"
        contained
        class="align-center justify-center"
      >
        <v-btn
          variant="outlined"
          size="x-large"
          color="white"
          :icon="icon"
          :href="href"
        ></v-btn>
      </v-overlay>
    </v-card>
  </v-hover>
</template>
<script>
export default {
  props: {
    animate: String,
    title: String,
    subtitle: String,
    text: String,
    icon: String,
    image: String,
    href: String,
  },
};
</script>
