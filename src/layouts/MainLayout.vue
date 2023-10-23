<template lang="pug">
q-layout(view="hHh Lpr lff")
  q-header
    q-toolbar
      q-btn(flat dense round icon="menu" @click="leftDrawer = !leftDrawer")
      q-toolbar-title
        q-avatar(icon="rocket_launch" size="xl")
        | kosmos3
      q-btn(v-if="rightDrawer !== null" flat dense round icon="more_vert" @click="rightDrawer = !rightDrawer")
  q-drawer(v-model="leftDrawer" show-if-above mini-to-overlay bordered :mini="miniState" side="left" @mouseover="miniState = false" @mouseout="miniState = true")
    q-list
      q-item(v-for="item in items" :key="item.title" v-bind="item" clickable :to="item.to")
        q-item-section(v-if="item.icon" avatar)
          q-icon(:name="item.icon")
        q-item-section
          q-item-label {{ item.title }}
  q-page-container.window-height
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
const { s3, rightDrawer } = storeToRefs(store);
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
    icon: "wysiwyg",
    to: "/content",
  },
  {
    title: "CSS",
    icon: "css",
    to: "/css",
  },
  {
    title: "JavaScript",
    icon: "javascript",
    to: "/js",
  },
  {
    title: "Settings",
    icon: "settings",
    to: "/settings",
  },
  {
    title: "Logout",
    icon: "logout",
    to: "/",
  },
];
const privateTo = privateItems
  .map((val) => val.to)
  .filter((val) => val !== "/");
const items = computed(() => (get(s3) ? privateItems : publicItems));
/**
 * Процедура перенаправляет на страницу аутентификации если пользователь не аутентифицирован и пытается зайти на приватную страницу
 * @param {object} root0 - route
 * @param {string} root0.path - путь
 */
const routeToRoot = ({ path }) => {
  if (!get(s3) && privateTo.includes(path)) router.push("/");
};
routeToRoot(useRoute());
onBeforeRouteLeave((to) => {
  routeToRoot(to);
});
</script>
