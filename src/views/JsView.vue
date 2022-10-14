<template>
  <div class="tox-tinymce fill-height">
    <v-tabs v-model="tab" show-arrows grow density="compact">
      <v-tab prepend-icon="mdi-format-list-bulleted" value="1"
        >JavaScript File URLs</v-tab
      ><v-tab prepend-icon="mdi-text-box-outline" value="2"
        >Function and Global Variable Declaration</v-tab
      ><v-tab prepend-icon="mdi-text-box-multiple-outline" value="3"
        >Execute when Page Loads</v-tab
      >
    </v-tabs>
    <v-window v-model="tab" class="fill-height"
      ><v-window-item class="fill-height" value="1"
        ><v-container fluid>
          <v-text-field
            v-for="(url, i) in jsJson"
            :key="i"
            v-model="jsJson[i]"
            variant="underlined"
            append-inner-icon="mdi-plus"
            prepend-inner-icon="mdi-minus"
            @click:prepend-inner="jsJson.length - 1 && jsJson.splice(i, 1)"
            @click:append-inner="jsJson.splice(i + 1, 0, '')"
            ><template #append
              ><v-btn
                icon="mdi-arrow-up"
                size="x-small"
                class="mr-1"
                @click="i && jsJson.splice(i - 1, 0, ...jsJson.splice(i, 1))"
              ></v-btn
              ><v-btn
                icon="mdi-arrow-down"
                size="x-small"
                class="ml-1"
                @click="
                  jsJson.length - (i + 1) &&
                    jsJson.splice(i + 1, 0, ...jsJson.splice(i, 1))
                "
              ></v-btn
            ></template> </v-text-field></v-container></v-window-item
      ><v-window-item class="fill-height" value="2">
        <v-source-code
          v-model.trim="jsJs"
          lang="javascript"
        ></v-source-code></v-window-item
      ><v-window-item class="fill-height" value="3">
        <v-source-code
          v-model.trim="indexJs"
          lang="javascript"
        ></v-source-code></v-window-item
    ></v-window>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, jsJson, jsJs, indexJs } = storeToRefs(store);
set(panel, null);
const tab = ref(1);
</script>
