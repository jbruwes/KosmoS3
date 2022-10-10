<template>
  <v-app>
    <v-app-bar app>
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title
        ><v-icon icon="mdi-rocket-launch" class="mr-2"></v-icon
        >kosmoS3</v-app-bar-title
      >
      <template v-if="panel !== null" #append>
        <v-btn icon @click.stop="panel = !panel">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <v-navigation-drawer
        v-model="drawer"
        app
        :temporary="mobile"
        :expand-on-hover="!mobile"
        :rail="!mobile"
      >
        <v-list nav :items="items"></v-list>
      </v-navigation-drawer>
      <v-container fluid class="fill-height">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
  <v-snackbar v-model="snackbar" location="top right">{{ message }}</v-snackbar>
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
const { s3, panel, snackbar, message } = storeToRefs(store);
const { mobile } = useDisplay();
const drawer = ref(!get(mobile));
const items = computed(() =>
  get(s3)
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
watch(s3, (newS3) => {
  if (newS3) router.push("/content");
});
</script>
<style>
html {
  overflow-y: auto !important;
}
</style>
