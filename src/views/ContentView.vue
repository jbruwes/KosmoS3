<template lang="pug">
v-navigation-drawer(
  v-model="panel",
  location="right",
  :width="320",
  :temporary="mobile"
)
  v-tabs(v-model="drawer", :grow="true", density="compact")
    v-tab(value="1", prepend-icon="mdi-file-tree") Structure
    v-tab(value="2", prepend-icon="mdi-card-bulleted-settings-outline") Attributes
  v-window(v-model="drawer")
    v-window-item(value="1")
      v-container.h-100(fluid) tree
    v-window-item(value="2")
      v-container.h-100(fluid) attrs
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow, density="compact")
    v-tab(value="1", prepend-icon="mdi-eye") Visual
    v-tab(value="2", prepend-icon="mdi-code-tags") Source
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1")
      v-wysiwyg(v-model.trim="content")
    v-window-item.h-100(value="2")
      v-source-code(v-model.trim="content")
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
