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
<script setup>
import { storeToRefs } from "pinia";
import app from "@/store/app";

const store = app();
const { tree, treeChildren, treeIcon, treeDescription, routePath } =
  storeToRefs(store);
const { getHref, getTitle } = store;
</script>
