<template>
  <v-navigation-drawer
    v-model="panel"
    location="right"
    :width="320"
    :temporary="mobile"
    ><v-tabs v-model="drawer" :grow="true" density="compact">
      <v-tab value="1" prepend-icon="mdi-file-tree">Structure</v-tab>
      <v-tab value="2" prepend-icon="mdi-card-bulleted-settings-outline"
        >Attributes</v-tab
      > </v-tabs
    ><v-window v-model="drawer"
      ><v-window-item value="1"
        ><v-container fluid class="fill-height"
          >tree</v-container
        ></v-window-item
      ><v-window-item value="2"
        ><v-container fluid class="fill-height"
          >attrs</v-container
        ></v-window-item
      ></v-window
    ></v-navigation-drawer
  >
  <div class="tox-tinymce fill-height">
    <v-tabs v-model="tab" show-arrows grow density="compact">
      <v-tab prepend-icon="mdi-eye" value="1">Visual</v-tab
      ><v-tab prepend-icon="mdi-code-tags" value="2">Source</v-tab>
    </v-tabs>
    <v-window v-model="tab" class="fill-height"
      ><v-window-item class="fill-height" value="1">
        <v-wysiwyg v-model.trim="content"></v-wysiwyg></v-window-item
      ><v-window-item class="fill-height" value="2"
        ><v-source-code v-model.trim="content"></v-source-code></v-window-item
    ></v-window>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, content } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref(1);
const drawer = ref(1);
</script>
