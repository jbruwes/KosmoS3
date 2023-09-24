<template lang="pug">
q-layout(view="hHh Lpr lff")
  q-header(elevated)
    q-toolbar
      q-btn(flat dense round icon="menu" aria-label="Menu" @click="leftDrawer = !leftDrawer")
      q-icon(name="rocket_launch" size="lg" right=true )
      q-toolbar-title kosmos3
  q-drawer(v-model="leftDrawer" show-if-above mini-to-overlay bordered :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true")
    q-list
      q-item(v-for="item in items" :key="item.title" v-bind="item" clickable :to="item.to")
        q-item-section(v-if="item.icon" avatar)
          q-icon(:name="item.icon")
        q-item-section
          q-item-label {{ item.title }}
  q-page-container
    router-view
</template>

<script setup>
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

import app from "@/stores/app";

const router = useRouter();
const store = app();
const { s3 } = storeToRefs(store);
const leftDrawer = ref(false);
const miniState = ref(true);
const publicItems = [
  {
    title: "Login",
    icon: "login",
    to: "/",
  },
  {
    title: "About",
    icon: "info",
    to: "/about",
  },
];
const privateItems = [
  {
    title: "Content",
    icon: "mdi-book-open-page-variant",
    to: "/content",
  },
  {
    title: "Template",
    icon: "mdi-language-html5",
    to: "/template",
  },
  {
    title: "CSS",
    icon: "mdi-language-css3",
    to: "/css",
  },
  {
    title: "JavaScript",
    icon: "mdi-language-javascript",
    to: "/js",
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    to: "/settings",
  },
  {
    title: "Logout",
    icon: "mdi-logout-variant",
    to: "/",
  },
];
const privateTo = privateItems
  .map((val) => val.to)
  .filter((val) => val !== "/");
const items = computed(() => (get(s3) ? privateItems : publicItems));
/**
 *
 * @param root0
 * @param root0.path
 */
const routeToRoot = ({ path }) => {
  if (!get(s3) && privateTo.includes(path)) router.push("/");
};
routeToRoot(useRoute());
onBeforeRouteLeave((to) => {
  routeToRoot(useRoute(to));
});
</script>
