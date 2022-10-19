<template lang="pug">
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow, density="compact")
    v-tab(value="1", prepend-icon="mdi-format-list-bulleted") CSS File URLs
    v-tab(value="2", prepend-icon="mdi-text-box-outline") Class Declaration
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1")
      v-container(fluid)
        v-text-field(
          v-for="(url, i) in stylesheets",
          :key="i",
          v-model="stylesheets[i]",
          variant="underlined",
          append-inner-icon="mdi-plus",
          prepend-inner-icon="mdi-minus",
          @click:prepend-inner="stylesheets.length - 1 && stylesheets.splice(i, 1)",
          @click:append-inner="stylesheets.splice(i + 1, 0, '')"
        )
          template(#append)
            v-btn.mr-1(
              icon="mdi-arrow-up",
              size="x-small",
              :disabled="!i",
              @click="stylesheets.splice(i - 1, 0, ...stylesheets.splice(i, 1))"
            )
            v-btn.ml-1(
              icon="mdi-arrow-down",
              size="x-small",
              :disabled="stylesheets.length === i + 1",
              @click="stylesheets.splice(i + 1, 0, ...stylesheets.splice(i, 1))"
            )
    v-window-item.h-100(value="2")
      v-source-code(v-model.trim="stylesheet", lang="css")
</template>
<script setup>
import { ref } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, stylesheets, stylesheet } = storeToRefs(store);
set(panel, null);
const tab = ref(1);
</script>
