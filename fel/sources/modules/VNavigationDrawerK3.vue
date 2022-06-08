<template>
  <v-navigation-drawer app temporary>
    <v-list-item>
      <v-list-item-avatar>
        <v-icon :icon="`mdi-${index.icon}`" size="x-large"></v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{ index.title ? index.title : index.value }}
        </v-list-item-title>
        <v-list-item-subtitle> {{ index.description }} </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-item
        v-for="(item, i) in index.data"
        :key="i"
        :value="item"
        active-color="primary"
      >
        <v-list-item-avatar>
          <v-icon :icon="`mdi-${item.icon}`" size="large"></v-icon>
        </v-list-item-avatar>
        <v-list-item-title>{{
          item.title ? item.title : item.value
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { storeToRefs } from "pinia";
import defineStore from "../stores/core.js";
export default {
  setup() {
    const core = defineStore();
    const { index } = storeToRefs(core);
    return { index };
  },
  data: () => ({
    selectedItem: 0,
  }),
};
</script>
