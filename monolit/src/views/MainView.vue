<template lang="pug">
.carousel-item.min-h-screen(
  v-for="object in the.siblings",
  :id="object.id",
  :key="object.id",
  ref="itemRefs"
)
  .hero(:style="backgroundImage(object)", :data-theme="object.theme")
    .hero-overlay(v-if="object.image && object.background && object.overlay")
    .prose(
      :class="{ container: object.responsive, 'w-full max-w-full': !object.responsive }"
    )
      v-runtime-template(:template="object.template")
</template>
<script setup>
import { get, useArrayFind } from "@vueuse/core";
import { mapState, storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";

import data from "../stores/data";

const { the } = storeToRefs(data());
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
  const [{ id }] = get(the, "siblings");
  return id;
});
const scrollToElementFirst = useArrayFind(
  itemRefs,
  ({ id }) => id === get(firstElementId),
);
const scrollToElementCurrent = useArrayFind(
  itemRefs,
  ({ id }) => id === get(the, "id"),
);
const scrollToElement = computed(
  () => get(scrollToElementCurrent) ?? get(scrollToElementFirst),
);
watch(scrollToElement, (value) => {
  setTimeout(() => {
    value?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });
});
</script>
<script>
export default {
  computed: { ...mapState(data, ["the"]) },
};
</script>
