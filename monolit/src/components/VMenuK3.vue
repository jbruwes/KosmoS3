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
<script setup>
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";

import app from "@/store/app";

const store = app();
const { treeChildren, siblings, routePath } = storeToRefs(store);
const { getTitle } = store;
const items = computed(() =>
  !get(routePath) || get(routePath) === "/" ? get(treeChildren) : get(siblings),
);
</script>
