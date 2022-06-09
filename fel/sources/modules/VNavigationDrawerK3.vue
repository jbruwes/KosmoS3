<template>
  <v-navigation-drawer app temporary>
    <v-list>
      <v-list-item
        :prepend-icon="`mdi-${index.icon}`"
        :title="title(index)"
        :subtitle="index.description"
        href="/"
      >
      </v-list-item
    ></v-list>
    <v-divider></v-divider>
    <v-list nav>
      <template v-for="(item, i) in index.data" :key="i" :value="item">
        <v-list-item
          v-if="item.visible"
          :prepend-icon="`mdi-${item.icon}`"
          :title="title(item)"
          :subtitle="item.description"
          :href="href(item)"
          :active="href(item) === decodeURI(window.location.pathname)"
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
    const { index } = storeToRefs(core);
    return { index };
  },
  data: () => ({
    selectedItem: 0,
  }),
  methods: {
    href: (item) => (item.href ? item.href : item.path),
    title: (item) => (item.title ? item.title : item.value),
  },
};
</script>
