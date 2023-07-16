<template lang="pug">
v-app.h-100
  v-app-bar(app)
    template(#prepend)
      v-app-bar-nav-icon(@click.stop="drawer = !drawer")
    v-app-bar-title
      v-icon.mr-2(icon="mdi-rocket-launch")
      | kosmos3
    template(v-if="panel !== null", #append)
      v-btn(icon, @click.stop="panel = !panel")
        v-icon mdi-dots-vertical
  v-main.d-flex.align-stretch.h-100
    v-navigation-drawer(
      v-model="drawer",
      app,
      :temporary="mobile",
      :expand-on-hover="!mobile",
      :rail="!mobile"
    )
      v-list(nav, :items="items")
    v-container.d-flex.align-stretch(fluid)
      router-view
v-snackbar(v-model="snackbar", location="top right") {{ message }}
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import app from "@/store/app";

const router = useRouter();
const store = app();
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
      ],
);
watch(s3, (value) => {
  if (value) router.push("/content");
});
</script>
