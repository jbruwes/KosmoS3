<template>
  <v-navigation-drawer app temporary>
    <v-list>
      <v-list-item
        :prepend-icon="`mdi-${icon}`"
        :title="index ? title(index) : ''"
        :subtitle="description"
        href="/"
      >
      </v-list-item
    ></v-list>
    <v-divider></v-divider>
    <v-list nav>
      <template v-for="(item, i) in data" :key="i" :value="item">
        <v-list-item
          v-if="item.visible"
          :prepend-icon="`mdi-${item.icon}`"
          :title="title(item)"
          :subtitle="item.description"
          :href="href(item)"
          :active="href(item) === routePath"
          active-color="primary"
        >
        </v-list-item
      ></template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { storeToRefs } from "pinia";
import defineStore from "../stores/core.js";
export default {
  setup() {
    const core = defineStore();
    const { index, data, icon, description, routePath } = storeToRefs(core);
    const { href, title } = core;
    return { index, data, icon, description, routePath, href, title };
  },
};
</script>
