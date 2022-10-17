<template lang="pug">
v-menu(close-on-click, location="start")
  template(#activator="{ props }")
    v-btn(icon="mdi-dots-vertical", v-bind="props")
  v-list(nav)
    template(v-for="(item, i) in items", :key="i")
      v-list-subheader(
        v-if="item.visible",
        :prepend-icon="`mdi-${item.icon}`",
        :title="getTitle(item)"
      )
</template>
<script>
import { mapState, mapActions } from "pinia";
import orbita from "@/orbita";

export default {
  computed: {
    /**
     * @returns {Array} Элементы меню
     */
    items() {
      return !this.routePath || this.routePath === "/"
        ? this.treeChildren
        : this.siblings;
    },
    ...mapState(orbita, ["treeChildren", "siblings", "routePath"]),
  },
  methods: { ...mapActions(orbita, ["getTitle"]) },
};
</script>
