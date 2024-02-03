<template lang="pug">
.carousel-item(
  v-for="the in selectedObject.siblings",
  :id="the.id",
  :key="the.id",
  ref="itemRefs",
  class="min-h-[100dvh]"
)
  .hero.overflow-x-hidden(
    :style="the.image && the.background ? { backgroundImage: `url(${the.image})` } : {}",
    :data-theme="the.theme"
  )
    .hero-overlay(v-if="the.overlay")
    .prose.prose-sm(
      :class="the.responsive ? 'container' : 'w-full max-w-none'",
      class="sm:prose-sm md:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
    )
      component(:is="theTemplate[the.id]", :the="the", :mdi="mdi")
</template>
<script setup>
import * as mdi from "@mdi/js";
import { get, useArrayFind, useArrayReduce } from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, ref, onUpdated, nextTick } from "vue";
import { useRoute } from "vue-router";

import app from "../stores/app";
import data from "../stores/data";

const { getTemplate } = app();
const { flatTree } = storeToRefs(data());
const route = useRoute();
const selectedObject = useArrayFind(flatTree, ({ id }) => id === route.name);
const configurable = true;
const theTemplate = useArrayReduce(
  () => get(selectedObject, "siblings"),
  (sum, { id, template, script, style }) => {
    const value = getTemplate({ id, template, script, style });
    Object.defineProperty(sum, id, { value, configurable });
    return sum;
  },
  {},
);
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
onUpdated(async () => {
  await nextTick();
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
  (get(scrollToElementCurrent) ?? get(scrollToElementFirst))?.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});
</script>
