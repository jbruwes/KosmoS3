<template lang="pug">
.carousel-item(
  v-for="the in siblings",
  :id="the.id",
  :key="the.id",
  ref="itemRefs",
  class="min-h-[100dvh]",
  un-cloak
)
  .hero(
    :style="the.image && the.background ? { backgroundImage: `url(${the.image})` } : {}",
    :data-theme="the.theme"
  )
    .hero-overlay(v-if="the.overlay")
    .prose.text-sm(
      :class="the?.responsive ? 'container' : 'w-full max-w-none'",
      class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
    )
      component(:is="theTemplate[the.id]", :the="the", :mdi="mdi")
</template>
<script setup>
import * as mdi from "@mdi/js";
import { get, useArrayFind, useArrayMap } from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";

import app from "../stores/app";
import data from "../stores/data";

const { getTemplate } = app();
const { flatTree } = storeToRefs(data());
const route = useRoute();
const selectedObject = useArrayFind(flatTree, ({ id }) => id === route.name);
const siblings = computed(() => get(selectedObject, "siblings"));
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
const firstElementId = computed(() => {
  const [{ id }] = get(selectedObject, "siblings");
  return id;
});
const scrollToElementFirst = useArrayFind(
  itemRefs,
  ({ id }) => id === get(firstElementId),
);
const scrollToElementCurrent = useArrayFind(
  itemRefs,
  ({ id }) => id === get(selectedObject, "id"),
);
const scrollToElement = computed(
  () => get(scrollToElementCurrent) ?? get(scrollToElementFirst),
);
watch(scrollToElement, async (value) => {
  await Promise.all(Object.values(Object.fromEntries(get(theTemplateEntries))));
  setTimeout(() => {
    value?.scrollIntoView();
  });
  GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    zoomable: false,
    selector: [
      '$=".apng"',
      '$=".avif"',
      '$=".gif"',
      '$=".jpg"',
      '$=".jpeg"',
      '$=".jfif"',
      '$=".pjpeg"',
      '$=".pjp"',
      '$=".png"',
      '$=".svg"',
      '$=".webp"',
      '^="https://www.youtube.com/embed/"',
      '^="https://www.youtube.com/watch?v="',
      '^="https://www.youtu.be/embed/"',
      '^="https://www.youtu.be/watch?v="',
      '^="https://www.youtube-nocookie.com/embed/"',
      '^="https://www.youtube-nocookie.com/watch?v="',
      '^="https://vimeo.com/"',
    ]
      .map((el) => `a[href${el}]`)
      .join(),
  });
});
</script>
