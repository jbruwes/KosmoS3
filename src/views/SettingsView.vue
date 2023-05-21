<template lang="pug">
.rounded.border.d-flex.flex-column.flex-fill.overflow-y-auto
  .ma-4
    .text-subtitle-1.text-medium-emphasis.mb-1 YANDEX
      v-text-field(
        v-if="settings",
        v-model.trim="settings.yandex",
        label="yandex verification id",
        prepend-inner-icon="mdi-alpha-y-circle-outline",
        variant="underlined"
      )
      v-text-field(
        v-if="settings",
        v-model.trim="settings.metrika",
        label="yandex metrika id",
        prepend-inner-icon="mdi-ruler",
        variant="underlined"
      )
      .text-subtitle-1.text-medium-emphasis.mb-1 GOOGLE
      v-text-field(
        v-if="settings",
        v-model.trim="settings.google",
        label="google verification id",
        prepend-inner-icon="mdi-google",
        variant="underlined"
      )
      v-text-field(
        v-if="settings",
        v-model.trim="settings.analytics",
        label="google analytics id",
        prepend-inner-icon="mdi-google-analytics",
        variant="underlined"
      )
      .text-subtitle-1.text-medium-emphasis.mb-1 ICON
      v-file-input(
        v-model="ico",
        accept="image/vnd.microsoft.icon",
        label="favicon.ico (32x32)",
        prepend-icon="mdi-postage-stamp",
        variant="underlined",
        :clearable="false"
      )
      v-file-input(
        v-model="svg",
        accept="image/svg+xml",
        label="icon.svg",
        prepend-icon="mdi-svg",
        variant="underlined",
        :clearable="false"
      )
      v-file-input(
        v-model="icon",
        accept="image/png",
        label="icon.png (192x192)",
        prepend-icon="mdi-file-png-box",
        variant="underlined",
        :clearable="false"
      )
      v-file-input(
        v-model="tile",
        accept="image/png",
        label="tile.png (558x558)",
        prepend-icon="mdi-file-png-box",
        variant="underlined",
        :clearable="false"
      )
      v-file-input(
        v-model="tileWide",
        accept="image/png",
        label="tile-wide.png (558x270)",
        prepend-icon="mdi-file-png-box",
        variant="underlined",
        :clearable="false"
      )
</template>
<script setup>
import { ref, watch } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/stores/kosmos3";

const store = kosmos3();
const { panel, settings } = storeToRefs(store);
const { putFile } = store;
const ico = ref([]);
const svg = ref([]);
const icon = ref([]);
const tile = ref([]);
const tileWide = ref([]);
set(panel, null);
watch(ico, (value) => {
  const [file] = value;
  if (file) putFile("favicon.ico", "image/vnd.microsoft.icon", file);
});
watch(svg, (value) => {
  const [file] = value;
  if (file) putFile("icon.svg", "image/svg+xml", file);
});
watch(icon, (value) => {
  const [file] = value;
  if (file) putFile("icon.png", "image/png", file);
});
watch(tile, (value) => {
  const [file] = value;
  if (file) putFile("tile.png", "image/png", file);
});
watch(tileWide, (value) => {
  const [file] = value;
  if (file) putFile("tile-wide.png", "image/png", file);
});
</script>
