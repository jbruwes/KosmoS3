<template lang="pug">
v-navigation-drawer(app, temporary)
  v-list
    v-list-item(
      :prepend-icon="`mdi-${treeIcon}`",
      :title="tree ? getTitle(tree) : ''",
      :subtitle="treeDescription",
      href="/"
    )
  v-divider
  v-list(nav)
    template(v-for="(item, i) in treeChildren", :key="i")
      v-list-item(
        v-if="item.visible",
        :prepend-icon="`mdi-${item.icon}`",
        :title="getTitle(item)",
        :subtitle="item.description",
        :href="getHref(item)",
        :active="getHref(item) === routePath",
        active-color="primary"
      )
</template>
<script>
import { mapState, mapActions } from "pinia";
import orbita from "@/orbita";

export default {
  computed: {
    ...mapState(orbita, [
      "tree",
      "treeChildren",
      "treeIcon",
      "treeDescription",
      "routePath",
    ]),
  },
  methods: { ...mapActions(orbita, ["getHref", "getTitle"]) },
};
</script>
