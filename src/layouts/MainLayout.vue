<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header(elevated)
    q-toolbar
      q-btn(flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer")
      q-toolbar-title kosmos3
      div Quasar v
        | {{ $q.version }}
  q-drawer(v-model="leftDrawer" show-if-above bordered :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true")
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
import { ref, computed, watch } from "vue";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import app from "@/stores/app";

const router = useRouter();
const store = app();
const { s3 } = storeToRefs(store);
const leftDrawer = ref(false);
const miniState = ref(true);
const items = computed(() =>
  get(s3)
    ? [
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
      ]
    : [
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
      ],
);
watch(s3, (value) => {
  if (value) router.push("/content");
});
</script>
