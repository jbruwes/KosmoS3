<template lang="pug">
.tox-tinymce.fill-height
  v-tabs(v-model="tab", show-arrows, grow, density="compact")
    v-tab(value="1", prepend-icon="mdi-format-list-bulleted") JavaScript File URLs
    v-tab(value="2", prepend-icon="mdi-text-box-outline") Function and Global Variable Declaration
  v-window.fill-height(v-model="tab")
    v-window-item.fill-height(value="1")
      v-container(fluid)
        v-text-field(
          v-for="(url, i) in cssCss",
          :key="i",
          v-model="cssCss[i]",
          variant="underlined",
          append-inner-icon="mdi-plus",
          prepend-inner-icon="mdi-minus",
          @click:prepend-inner="cssCss.length - 1 && cssCss.splice(i, 1)",
          @click:append-inner="cssCss.splice(i + 1, 0, '')"
        )
          template(#append)
            v-btn.mr-1(
              icon="mdi-arrow-up",
              size="x-small",
              :disabled="!i",
              @click="cssCss.splice(i - 1, 0, ...cssCss.splice(i, 1))"
            )
            v-btn.ml-1(
              icon="mdi-arrow-down",
              size="x-small",
              :disabled="cssCss.length === i + 1",
              @click="cssCss.splice(i + 1, 0, ...cssCss.splice(i, 1))"
            )
    v-window-item.fill-height(value="2")
      v-source-code(v-model.trim="indexCss", lang="css")
</template>
<script setup>
import { ref } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, cssCss, indexCss } = storeToRefs(store);
set(panel, null);
const tab = ref(1);
</script>
