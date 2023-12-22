<template lang="pug">
q-page.column.full-height
  q-card.q-ma-xl.col.scroll(flat)
    q-card-section
      .text-h6 YANDEX
    q-separator
    q-card-section
      q-input(
        v-if="settings",
        v-model.trim="settings.yandex",
        label="yandex verification id"
      )
        template(#prepend)
          q-icon(name="mdi-alpha-y-circle-outline")
      q-input(
        v-if="settings",
        v-model.trim="settings.metrika",
        label="yandex metrika id"
      )
        template(#prepend)
          q-icon(name="mdi-ruler")
    q-card-section
      .text-h6 GOOGLE
    q-separator
    q-card-section
      q-input(
        v-if="settings",
        v-model.trim="settings.google",
        label="google verification id"
      )
        template(#prepend)
          q-icon(name="mdi-google")
      q-input(
        v-if="settings",
        v-model.trim="settings.analytics",
        label="google analytics id"
      )
        template(#prepend)
          q-icon(name="mdi-google-analytics")
    q-card-section
      .text-h6 ЦВЕТОВАЯ ТЕМА
    q-separator
    q-card-section
      q-select(
        v-if="settings",
        v-model="settings.theme",
        label="Цветовая тема",
        :options="themes"
      )
        template(#prepend)
          q-icon(name="mdi-theme-light-dark")
</template>
<script setup>
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { reactive } from "vue";

import app from "@/stores/app";

const { settings, state } = storeToRefs(app());
const themes = reactive([
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
]);
get(state).rightDrawer = null;
</script>
