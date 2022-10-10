<template>
  <div class="tox-tinymce fill-height">
    <div class="ma-4">
      <div class="text-subtitle-1 text-medium-emphasis mb-1">YANDEX</div>
      <v-text-field
        v-model.trim="semantics[0].yandex"
        label="yandex verification id"
        prepend-inner-icon="mdi-alpha-y-circle-outline"
        variant="underlined"
      ></v-text-field
      ><v-text-field
        v-model.trim="semantics[0].metrika"
        label="yandex metrika id"
        prepend-inner-icon="mdi-ruler"
        variant="underlined"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis mb-1">GOOGLE</div>
      <v-text-field
        v-model.trim="semantics[0].google"
        label="google verification id"
        prepend-inner-icon="mdi-google"
        variant="underlined"
      ></v-text-field
      ><v-text-field
        v-model.trim="semantics[0].analytics"
        label="google analytics id"
        prepend-inner-icon="mdi-google-analytics"
        variant="underlined"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis mb-1">ICON</div>
      <v-file-input
        v-model="ico"
        accept="image/vnd.microsoft.icon"
        label="favicon.ico (32x32)"
        prepend-icon="mdi-postage-stamp"
        variant="underlined"
        :clearable="false"
      ></v-file-input>
      <v-file-input
        v-model="svg"
        accept="image/svg+xml"
        label="icon.svg"
        prepend-icon="mdi-svg"
        variant="underlined"
        :clearable="false"
      ></v-file-input>
      <v-file-input
        v-model="icon"
        accept="image/png"
        label="icon.png (192x192)"
        prepend-icon="mdi-file-png-box"
        variant="underlined"
        :clearable="false"
      ></v-file-input>
      <v-file-input
        v-model="tile"
        accept="image/png"
        label="tile.png (558x558)"
        prepend-icon="mdi-file-png-box"
        variant="underlined"
        :clearable="false"
      ></v-file-input>
      <v-file-input
        v-model="tileWide"
        accept="image/png"
        label="tile-wide.png (558x270)"
        prepend-icon="mdi-file-png-box"
        variant="underlined"
        :clearable="false"
      ></v-file-input>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";

const store = kosmos3();
const { panel, semantics } = storeToRefs(store);
const { putFile } = store;
const ico = ref([]);
const svg = ref([]);
const icon = ref([]);
const tile = ref([]);
const tileWide = ref([]);
set(panel, null);
watch(ico, (newIco) => {
  const [file] = newIco;
  if (file) putFile("favicon.ico", "image/vnd.microsoft.icon", file);
});
watch(svg, (newSvg) => {
  const [file] = newSvg;
  if (file) putFile("icon.svg", "image/svg+xml", file);
});
watch(icon, (newIcon) => {
  const [file] = newIcon;
  if (file) putFile("icon.png", "image/png", file);
});
watch(tile, (newTile) => {
  const [file] = newTile;
  if (file) putFile("tile.png", "image/png", file);
});
watch(tileWide, (newTileWide) => {
  const [file] = newTileWide;
  if (file) putFile("tile-wide.png", "image/png", file);
});
</script>
