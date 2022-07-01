<template>
  <v-menu close-on-click location="start">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-dots-vertical" v-bind="props"> </v-btn>
    </template>
    <v-list nav>
      <template v-for="(item, i) in items" :key="i" :value="item">
        <v-list-subheader
          v-if="item.visible"
          :prepend-icon="`mdi-${item.icon}`"
          :title="getTitle(item)"
        >
        </v-list-subheader></template
    ></v-list>
  </v-menu>
</template>
<script>
import { storeToRefs } from "pinia";
import defineStore from "../stores/core.js";
export default {
  setup() {
    const core = defineStore();
    const { treeChildren, siblings, routePath } = storeToRefs(core);
    const { getPath, getTitle } = core;
    return { treeChildren, siblings, routePath, getPath, getTitle };
  },
  computed: {
    items() {
      return !this.routePath || this.routePath === "/"
        ? this.treeChildren
        : this.siblings;
    },
  },
};
</script>
