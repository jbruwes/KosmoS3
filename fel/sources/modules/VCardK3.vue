<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" width="290px">
      <v-img :src="img"></v-img>
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
        ></v-btn>
      </v-overlay>
    </v-card>
  </v-hover>
</template>
<script>
export default {
  props: {
    title: String,
    subtitle: String,
    text: String,
    icon: String,
    img: String,
  },
};
</script>
