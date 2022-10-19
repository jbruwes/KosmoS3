<template lang="pug">
.tox-tinymce.h-100
  v-tabs(v-model="tab", show-arrows, grow, density="compact")
    v-tab(value="1", prepend-icon="mdi-format-list-bulleted") JavaScript File URLs
    v-tab(value="2", prepend-icon="mdi-text-box-outline") Function and Global Variable Declaration
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1")
      v-container(fluid)
        v-text-field(
          v-for="(url, i) in javascripts",
          :key="i",
          v-model="javascripts[i]",
          variant="underlined",
          append-inner-icon="mdi-plus",
          prepend-inner-icon="mdi-minus",
          @click:prepend-inner="javascripts.length - 1 && javascripts.splice(i, 1)",
          @click:append-inner="javascripts.splice(i + 1, 0, '')"
        )
          template(#append)
            v-btn.mr-1(
              icon="mdi-arrow-up",
              size="x-small",
              :disabled="!i",
              @click="javascripts.splice(i - 1, 0, ...javascripts.splice(i, 1))"
            )
            v-btn.ml-1(
              icon="mdi-arrow-down",
              size="x-small",
              :disabled="javascripts.length === i + 1",
              @click="javascripts.splice(i + 1, 0, ...javascripts.splice(i, 1))"
            )
    v-window-item.h-100(value="2")
      v-source-code(v-model.trim="javascript", lang="javascript")
</template>
<script setup>
import { ref } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, javascripts, javascript } = storeToRefs(store);
set(panel, null);
const tab = ref(1);
</script>
