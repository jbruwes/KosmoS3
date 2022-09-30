<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon
      ><v-toolbar-title
        ><v-icon icon="mdi-rocket-launch" class="mr-2"></v-icon
        >kosmoS3</v-toolbar-title
      >
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      :temporary="mobile"
      :expand-on-hover="!mobile"
      :rail="!mobile"
    >
      <v-list nav :items="items"></v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid class="fill-height">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import kosmos3 from "./kosmos3";

const router = useRouter();
const store = kosmos3();
const { auth } = storeToRefs(store);
const { mobile } = useDisplay();
const drawer = ref(!get(mobile));
const items = computed(() =>
  get(auth)
    ? [
        {
          title: "Content",
          props: {
            prependIcon: "mdi-book-open-page-variant",
            to: "/content",
          },
        },
        {
          title: "Template",
          props: {
            prependIcon: "mdi-language-html5",
            to: "/template",
          },
        },
        {
          title: "CSS",
          props: {
            prependIcon: "mdi-language-css3",
            to: "/css",
          },
        },
        {
          title: "JavaScript",
          props: {
            prependIcon: "mdi-language-javascript",
            to: "/js",
          },
        },
        {
          title: "Settings",
          props: {
            prependIcon: "mdi-cog",
            to: "/settings",
          },
        },
        {
          title: "Logout",
          props: {
            prependIcon: "mdi-logout-variant",
            to: "/",
          },
        },
      ]
    : [
        {
          title: "Login",
          props: {
            prependIcon: "mdi-login-variant",
            to: "/",
          },
        },
        {
          title: "About",
          props: {
            prependIcon: "mdi-information-outline",
            to: "/about",
          },
        },
      ]
);
watch(auth, (newAuth) => {
  if (newAuth) router.push("/content");
});
</script>
<style>
html {
  overflow-y: auto !important;
}
</style>
