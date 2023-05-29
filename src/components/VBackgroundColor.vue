<template lang="pug">
v-select(
  v-model="color",
  label="color",
  :items="colors",
  clearable,
  @update:model-value="variant = color"
)
  template(#item="{ props, item }")
    v-list-item(v-bind="props", :title="item.raw")
      template(#prepend)
        v-icon(icon="mdi-circle", :color="item.raw")
v-btn-toggle.flex-wrap.justify-space-around.h-auto(
  v-model="variant",
  rounded="0",
  mandatory,
  variant="text"
)
  v-btn.py-1(
    v-for="(item, index) in variants",
    :key="index",
    :value="item",
    size="x-large",
    density="compact"
  )
    v-icon(icon="mdi-circle", :color="item")
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { get, set, isDefined } from "@vueuse/core";
import template3 from "@/store/template3";

const localStore = template3();
const { fromClassesOnce, toClassesOnce, deleteClasses } = localStore;
const singleVariants = [
  "black",
  "white",
  "transparent",
  "shades-black",
  "shades-white",
  "shades-transparent",
];
/**
 * заполение массива вариантами цвета
 * @param {string} color название цвета
 * @param {string} variant название варианта
 * @param {number} count количество вариантов
 * @returns {Array} массив вариантов цвета
 */
const getVariants = (color, variant, count) =>
  singleVariants.includes(color)
    ? []
    : [...Array(count).keys()].map(
        (element) => `${color}-${variant}-${element + 1}`
      );
const colors = reactive([
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "blue-grey",
  "grey",
  ...singleVariants,
]);
const mask = (() => `(${colors.join("|")}).*`)();
const initColor = computed(() => {
  const cmpClass = fromClassesOnce("bg", mask, false);
  return colors.find((element) => cmpClass.startsWith(element));
});
const color = ref(get(initColor));
watch(initColor, (value) => {
  set(color, value);
});
const lighten = computed(() =>
  isDefined(color) ? getVariants(get(color), "lighten", 5) : []
);
const darken = computed(() =>
  isDefined(color) ? getVariants(get(color), "darken", 4) : []
);
const accent = computed(() =>
  isDefined(color) && !["grey", "blue-grey", "brown"].includes(get(color))
    ? getVariants(get(color), "accent", 4)
    : []
);
const variants = computed(() => [
  ...get(lighten).reverse(),
  ...(isDefined(color) && !singleVariants.includes(get(color))
    ? [get(color)]
    : []),
  ...get(darken),
  ...get(accent).reverse(),
]);
const variant = computed({
  /** @returns {string} значение цвета */
  get() {
    return fromClassesOnce("bg", mask, false);
  },
  /** @param {string} value значение цвета */
  set(value) {
    deleteClasses("bg", mask, false);
    toClassesOnce("bg", value, false);
  },
});
</script>
