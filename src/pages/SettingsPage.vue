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
</template>
<script setup>
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";

import storeApp from "@/stores/app";
import storeSettings from "@/stores/settings";

const { rightDrawer } = storeToRefs(storeApp());
const { settings } = storeToRefs(storeSettings());
set(rightDrawer, null);
</script>
