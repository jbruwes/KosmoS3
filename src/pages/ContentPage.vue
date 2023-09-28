<template lang="pug">
q-drawer(v-if="s3" v-model="rightDrawer" bordered side="right")
q-page.column.full-height
  q-editor.col.column.q-ma-md(v-model="qeditor" content-class="col")
</template>
<script setup>
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref } from "vue";

import app from "@/stores/app";

const store = app();
const { s3, rightDrawer } = storeToRefs(store);
set(rightDrawer, true);
const qeditor = ref("");
</script>
