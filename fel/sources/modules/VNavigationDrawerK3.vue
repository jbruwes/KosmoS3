<template>
  <v-navigation-drawer app temporary>
    <v-list>
      <v-list-item
        :prepend-icon="`mdi-${treeIcon}`"
        :title="tree ? getTitle(tree) : ''"
        :subtitle="treeDescription"
        href="/"
      >
      </v-list-item
    ></v-list>
    <v-divider></v-divider>
    <v-list nav>
      <template v-for="(item, i) in treeChildren" :key="i" :value="item">
        <v-list-item
          v-if="item.visible"
          :prepend-icon="`mdi-${item.icon}`"
          :title="getTitle(item)"
          :subtitle="item.description"
          :href="getPath(item)"
          :active="getPath(item) === routePath"
          active-color="primary"
        >
        </v-list-item
      ></template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapState, mapActions } from "pinia";
import core from "+/core.js";
export default {
  computed: {
    ...mapState(core, [
      "tree",
      "treeChildren",
      "treeIcon",
      "treeDescription",
      "routePath",
    ]),
  },
  methods: { ...mapActions(core, ["getPath", "getTitle"]) },
};
</script>
