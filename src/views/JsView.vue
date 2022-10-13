<template>
  <v-navigation-drawer
    v-model="panel"
    location="right"
    :width="320"
    :temporary="mobile"
  ></v-navigation-drawer>
  <div class="tox-tinymce fill-height">
    <v-source-code v-model.trim="javascript" lang="javascript"></v-source-code>
  </div>
</template>
<script setup>
import { set, get } from "@vueuse/core";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, javascript } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
</script>
