<template lang="pug">
.carousel-item.min-h-screen(
  v-for="the in selectedObject.siblings",
  :id="the.id",
  :key="the.id",
  ref="itemRefs"
)
  .hero(:style="backgroundImage(the)", :data-theme="the.theme")
    .hero-overlay(v-if="the.image && the.background && the.overlay")
    .prose(
      :class="{ container: the.responsive, 'w-full max-w-full': !the.responsive }"
    )
      v-runtime-template(
        :template="the.template",
        :template-props="{ mdi, the }"
      )
</template>
<script setup>
import * as mdi from "@mdi/js";
import { get, useArrayFind } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";

import data from "../stores/data";

const { selectedObject } = storeToRefs(data());
/**
 * @param {object} object - Страница
 * @param {string} object.image - URL картинки
 * @param {boolean} object.background - Флаг видимости фона
 * @returns {object} - Объект со стилями
 */
const backgroundImage = ({ image, background }) =>
  image && background
    ? {
        backgroundImage: `url(${image})`,
      }
    : {};
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
