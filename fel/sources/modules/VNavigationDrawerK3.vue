<template>
  <v-navigation-drawer app temporary>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{ index2 ? index2.value: "Title!" }}
        </v-list-item-title>
        <v-list-item-subtitle> {{ store.index ? store.index.value: "Subtitle" }} </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
import * as store from "../stores/store.js";
import * as index2 from "../stores/index.js";
export default {
  data: () => ({
    test: "Title",
    store,
    index2,
  }),
  watch: {
    store() {
      console.log("watch ", this.store.index);
    },
  },
};
</script>
