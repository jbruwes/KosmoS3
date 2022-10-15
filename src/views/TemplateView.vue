<template lang="pug">
v-navigation-drawer(
  v-model="panel",
  location="right",
  :width="320",
  :temporary="mobile"
)
div TemplateView
</template>
<script setup>
import { set, get } from "@vueuse/core";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";

const store = kosmos3();
const { panel } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
</script>
