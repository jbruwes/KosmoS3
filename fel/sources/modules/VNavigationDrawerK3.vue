<template>
  <v-navigation-drawer app temporary>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{ mainTitle }}
        </v-list-item-title>
        <v-list-item-subtitle> {{ mainDescription }} </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        active-color="primary"
      >
        <v-list-item-avatar>
          <v-icon :icon="item.icon"></v-icon>
        </v-list-item-avatar>

        <v-list-item-title v-text="item.text"></v-list-item-title>
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
    const { mainTitle, mainDescription } = storeToRefs(core);
    return { mainTitle, mainDescription };
  },
  data: () => ({
    selectedItem: 0,
    items: [
      { text: "My Files", icon: "mdi-folder" },
      { text: "Shared with me", icon: "mdi-account-multiple" },
      { text: "Starred", icon: "mdi-star" },
      { text: "Recent", icon: "mdi-history" },
      { text: "Offline", icon: "mdi-check-circle" },
      { text: "Uploads", icon: "mdi-upload" },
      { text: "Backups", icon: "mdi-cloud-upload" },
    ],
  }),
};
</script>
