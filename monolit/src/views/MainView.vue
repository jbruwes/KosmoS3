<template lang="pug">
.flex.snap-start(
  v-for="the in siblings",
  :id="the.id",
  :key="the.id",
  ref="refs",
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
  unrefElement,
  useArrayFind,
  useArrayFindIndex,
  useArrayMap,
  useIntersectionObserver,
  useParentElement,
  watchDeep,
} from "@vueuse/core";
import GLightbox from "glightbox";
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import selector from "@/assets/glightbox.json";
import app from "@/stores/app";
import data from "@/stores/data";

const { getTemplate } = app();
const { flatTree } = storeToRefs(data());
const route = useRoute();
const router = useRouter();
const root = useParentElement();
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
const refs = ref([]);
const scrollToElementCurrent = useArrayFind(
  refs,
  ({ id }) => id === get(selectedObject, "id"),
);
watchDeep(refs, async (value) => {
  await Promise.all(Object.values(Object.fromEntries(get(theTemplateEntries))));
  setTimeout(() => {
    unrefElement(scrollToElementCurrent).scrollIntoView({
      behavior: "instant",
    });
    /**
     * @param {Array} entries - Массив объектов, описывающих пересечения
     * @param {object} entries."0" - Первый и единственный объект, описывающий
     *   пересечение
     */
    const onIntersectionObserver = ([
      {
        isIntersecting,
        target: { id: name },
      },
    ]) => {
      if (isIntersecting && name !== get(selectedObject, "id"))
        router.push({ name });
    };
    value.forEach((target) => {
      useIntersectionObserver(target, onIntersectionObserver, {
        root,
        rootMargin: "-1px 0px -100%",
        threshold: 0,
      });
    });
    GLightbox({
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
      zoomable: false,
      selector: selector.map((el) => `a[href${el}]`).join(),
    });
  }, 200);
});
</script>
