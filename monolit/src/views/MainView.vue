<template lang="pug">
.flex.snap-start(
  v-for="the in siblings",
  :id="the.id",
  :key="the.id",
  ref="itemRefs",
  :class="{ 'min-h-full': the.full }"
)
  .prose.max-w-none.flex-auto.text-sm(
    class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
    :data-theme="the.theme",
    :role="the.id === selectedObject.id ? 'main' : undefined",
    un-cloak
  )
    component(:is="theTemplate[the.id]", :the="the", :mdi="mdi")
</template>
<script setup>
import * as mdi from "@mdi/js";
import {
  get,
  useArrayFind,
  useArrayMap,
  useArrayFindIndex,
} from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";

import app from "@/stores/app";
import data from "@/stores/data";
import selector from "@/assets/glightbox.json";
const { getTemplate } = app();
const { flatTree } = storeToRefs(data());
const route = useRoute();
const selectedObjectIndex = useArrayFindIndex(
  flatTree,
  ({ id }) => id === route.name,
);
const selectedObject = computed(() =>
  get(selectedObjectIndex)
    ? get(flatTree, get(selectedObjectIndex))
    : get(flatTree, 0).children?.[0],
);
const siblings = computed(() => get(selectedObject)?.siblings);
const theTemplateEntries = useArrayMap(
  siblings,
  ({ id, template, script, style }) => [
    id,
    getTemplate({ id, template, script, style }),
  ],
);
const theTemplateArray = useArrayMap(theTemplateEntries, ([key, value]) => [
  key,
  defineAsyncComponent(() => value),
]);
const theTemplate = computed(() => Object.fromEntries(get(theTemplateArray)));
const itemRefs = ref([]);
const scrollToElementCurrent = useArrayFind(
  itemRefs,
  ({ id }) => id === get(selectedObject, "id"),
);
watch(scrollToElementCurrent, async (value) => {
  console.log(Object.values(Object.fromEntries(get(theTemplateEntries))));
  await Promise.all(Object.values(Object.fromEntries(get(theTemplateEntries))));
  setTimeout(() => {
    value?.scrollIntoView({ behavior: "smooth" });
  }, 500);
  GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    zoomable: false,
    selector: selector.map((el) => `a[href${el}]`).join(),
  });
});
</script>
