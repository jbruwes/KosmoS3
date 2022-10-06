<template>
  <v-navigation-drawer
    v-model="panel"
    location="right"
    :width="320"
    :temporary="mobile"
    ><v-tabs v-model="properties" :grow="true" density="compact">
      <v-tab value="tree" prepend-icon="mdi-file-tree">Structure</v-tab>
      <v-tab value="attrs" prepend-icon="mdi-card-bulleted-settings-outline"
        >Attributes</v-tab
      > </v-tabs
    ><v-window v-model="properties"
      ><v-window-item value="tree"
        ><v-container fluid class="fill-height"
          >tree</v-container
        ></v-window-item
      ><v-window-item value="attrs"
        ><v-container fluid class="fill-height"
          >attrs</v-container
        ></v-window-item
      ></v-window
    ></v-navigation-drawer
  >
  <v-window v-model="edit" class="tox-tinymce fill-height"
    ><v-window-item class="fill-height" value="visual">
      <v-tinymce-editor
        v-model:value="content"
      ></v-tinymce-editor></v-window-item
    ><v-window-item class="fill-height" value="source">
      <v-ace-editor
        v-model:value="content"
        lang="html"
        theme="chrome"
        style="height: 100%"
      ></v-ace-editor></v-window-item
  ></v-window>
  <v-bottom-navigation
    v-model="edit"
    :grow="true"
    :mandatory="true"
    mode="horizontal"
    density="compact"
  >
    <v-btn value="visual" append-icon="mdi-eye">Visual</v-btn>
    <v-btn value="source" append-icon="mdi-code-tags">Source</v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/webpack-resolver";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import VTinymceEditor from "@/components/VTinymceEditor.vue";

const store = kosmos3();
const { panel } = storeToRefs(store);
const { mobile } = useDisplay();
set(panel, !get(mobile));
const edit = ref("visual");
const properties = ref("tree");
const content = ref("");
</script>
