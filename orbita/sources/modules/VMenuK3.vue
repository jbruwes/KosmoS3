<template>
  <v-menu close-on-click location="start">
    <template #activator="{ props }">
      <v-btn icon="mdi-dots-vertical" v-bind="props"> </v-btn>
    </template>
    <v-list nav>
      <template v-for="(item, i) in items" :key="i">
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
import { mapState, mapActions } from "pinia";
import sputnik from "@/sputnik";

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
    ...mapState(sputnik, ["treeChildren", "siblings", "routePath"]),
  },
  methods: { ...mapActions(sputnik, ["getTitle"]) },
};
</script>
