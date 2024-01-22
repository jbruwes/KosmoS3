<template lang="pug">
.carousel-item(
  v-for="the in selectedObject.siblings",
  :id="the.id",
  :key="the.id",
  ref="itemRefs",
  class="min-h-[100dvh]"
)
  .hero(
    :style="the.image && the.background ? { backgroundImage: `url(${the.image})` } : {}",
    :data-theme="the.theme"
  )
    .hero-overlay(v-if="the.overlay")
    .prose(
      :class="{ container: the.responsive, 'w-full max-w-none': !the.responsive }"
    )
      component(:is="theTemplate[the.id]", :the="the", :mdi="mdi")
</template>
<script setup>
import * as mdi from "@mdi/js";
import { get, useArrayFind, useArrayReduce } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import app from "../stores/app";
import data from "../stores/data";

const { getTemplate } = app();
const { flatTree } = storeToRefs(data());
const route = useRoute();
const selectedObject = useArrayFind(flatTree, ({ id }) => id === route.name);
const theTemplate = useArrayReduce(
  get(selectedObject, "siblings"),
  (sum, { id, template, script, style }) => {
    const value = getTemplate({ id, template, script, style });
    Object.defineProperty(sum, id, { value });
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
watch(
  () => get(scrollToElementCurrent) ?? get(scrollToElementFirst),
  (value) => {
    setTimeout(() => {
      value?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  },
);
</script>
