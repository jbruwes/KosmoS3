<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon
      ><v-toolbar-title text="kosmoS3"></v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      app
      v-model="drawer"
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
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { get } from "@vueuse/core";
const { mobile } = useDisplay();
const drawer = ref(!get(mobile));
const items = ref([
  {
    title: "Home",
    props: {
      prependIcon: "mdi-home-outline",
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
]);
</script>
<style>
html { overflow-y: auto }
</style>
