<template lang="pug">
v-expansion-panels(v-model="panel", variant="accordion", mandatory)
  v-expansion-panel(title="layout classes", :value="0")
    v-expansion-panel-text
      v-elevation
      v-background-color
      v-select(
        v-model="position",
        :items="positions",
        label="position",
        clearable
      )
      v-select(v-model="height", :items="heights", label="height", clearable)
      v-select(v-model="width", :items="widths", label="width", clearable)
  v-expansion-panel(title="text classes", :value="1")
    v-expansion-panel-text
      v-select(
        v-model="textDecoration",
        :items="textDecorations",
        label="decoration",
        clearable
      )
      v-select(
        v-model="textWhiteSpace",
        :items="textWhiteSpaces",
        label="white space",
        clearable
      )
      v-checkbox(v-model="textBreak", label="word break", density="compact")
      v-checkbox(v-model="textTruncate", label="truncate", density="compact")
      v-select(
        v-model="textTransform",
        :items="textTransforms",
        label="transform",
        clearable
      )
      v-select(
        v-model="fontWeight",
        :items="fontWeights",
        label="font weight",
        clearable
      )
      v-checkbox(v-model="fontItalic", label="italic", density="compact")
      v-checkbox(v-model="textMono", label="mono", density="compact")
      v-text-color
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import template3 from "@/store/template3";
import VElevation from "./VElevation.vue";
import VTextColor from "./VTextColor.vue";
import VBackgroundColor from "./VBackgroundColor.vue";

const localStore = template3();
const { fromClassesOnce, toClassesOnce, deleteClasses } = localStore;
const panel = ref(0);

/**
 * @param {string} value - входное значение для проверки окончания на %
 * @returns {string} - строка без % на конце
 */
const replacePercent = (value) => value.replace(/%$/, "");

const heights = reactive(["screen", "auto", "0%", "25%", "50%", "75%", "100%"]);
const heightsWithoutPercents = heights.map(replacePercent);
const heightsJoined = heightsWithoutPercents.join("|");
const heightsMask = `(${heightsJoined})`;
const height = computed({
  /** @returns {string} значение position */
  get() {
    const result = fromClassesOnce("h", heightsMask, false);
    const ret =
      !result || ["screen", "auto"].includes(result) ? result : `${result}%`;
    return ret;
  },
  /** @param {string} value значение position */
  set(value) {
    deleteClasses("h", heightsMask, false);
    const lClass = value ? value.replace(/%$/, "") : value;
    toClassesOnce("h", lClass, false);
  },
});

const widths = reactive([
  "auto",
  "0%",
  "25%",
  "33%",
  "50%",
  "66%",
  "75%",
  "100%",
]);
const widthsWithoutPercents = widths.map(replacePercent);
const widthsJoined = widthsWithoutPercents.join("|");
const widthsMask = `(${widthsJoined})`;
const width = computed({
  /** @returns {string} значение position */
  get() {
    const result = fromClassesOnce("w", widthsMask, false);
    const ret = !result || result === "auto" ? result : `${result}%`;
    return ret;
  },
  /** @param {string} value значение position */
  set(value) {
    deleteClasses("w", widthsMask, false);
    const lClass = value ? value.replace(/%$/, "") : value;
    toClassesOnce("w", lClass, false);
  },
});

const positions = reactive([
  "static",
  "relative",
  "fixed",
  "absolute",
  "sticky",
]);
const position = computed({
  /** @returns {string} значение position */
  get() {
    return fromClassesOnce("position", `(${positions.join("|")})`, false);
  },
  /** @param {string} value значение position */
  set(value) {
    deleteClasses("position", `(${positions.join("|")})`, false);
    toClassesOnce("position", value, false);
  },
});

const textDecorations = reactive([
  "decoration-line-through",
  "decoration-none",
  "decoration-overline",
  "decoration-underline",
]);
const textDecoration = computed({
  /** @returns {string} значение textDecoration */
  get() {
    return fromClassesOnce("text", `(${textDecorations.join("|")})`, false);
  },
  /** @param {string} value значение textDecoration */
  set(value) {
    deleteClasses("text", `(${textDecorations.join("|")})`, false);
    toClassesOnce("text", value, false);
  },
});
const textWhiteSpaces = reactive([
  "wrap",
  "no-wrap",
  "pre",
  "pre-line",
  "pre-wrap",
]);
const textWhiteSpace = computed({
  /** @returns {string} значение textWhiteSpace */
  get() {
    return fromClassesOnce("text", `(${textWhiteSpaces.join("|")})`, false);
  },
  /** @param {string} value значение textWhiteSpace */
  set(value) {
    deleteClasses("text", `(${textWhiteSpaces.join("|")})`, false);
    toClassesOnce("text", value, false);
  },
});
const textBreak = computed({
  /** @returns {string} значение textBreak */
  get() {
    return !!fromClassesOnce("text", "break", false);
  },
  /** @param {string} value значение textBreak */
  set(value) {
    deleteClasses("text", "break", false);
    toClassesOnce("text", value ? "break" : value, false);
  },
});
const textTruncate = computed({
  /** @returns {string} значение textTruncate */
  get() {
    return !!fromClassesOnce("text", "truncate", false);
  },
  /** @param {string} value значение textTruncate */
  set(value) {
    deleteClasses("text", "truncate", false);
    toClassesOnce("text", value ? "truncate" : value, false);
  },
});
const textTransforms = reactive([
  "none",
  "capitalize",
  "lowercase",
  "uppercase",
]);
const textTransform = computed({
  /** @returns {string} значение textTransform */
  get() {
    return fromClassesOnce("text", `(${textTransforms.join("|")})`, false);
  },
  /** @param {string} value значение textTransform */
  set(value) {
    deleteClasses("text", `(${textTransforms.join("|")})`, false);
    toClassesOnce("text", value, false);
  },
});
const fontWeights = reactive([
  "thin",
  "light",
  "regular",
  "medium",
  "bold",
  "black",
]);
const fontWeight = computed({
  /** @returns {string} значение fontWeight */
  get() {
    return fromClassesOnce("font-weight", `(${fontWeights.join("|")})`);
  },
  /** @param {string} value значение fontWeight */
  set(value) {
    deleteClasses("font-weight", `(${fontWeights.join("|")})`, false);
    toClassesOnce("font-weight", value, false);
  },
});
const fontItalic = computed({
  /** @returns {string} значение fontItalic */
  get() {
    return !!fromClassesOnce("font", "italic", false);
  },
  /** @param {string} value значение fontItalic */
  set(value) {
    deleteClasses("font", "italic", false);
    toClassesOnce("font", value ? "italic" : value, false);
  },
});
const textMono = computed({
  /** @returns {string} значение textMono */
  get() {
    return !!fromClassesOnce("text", "mono", false);
  },
  /** @param {string} value значение textMono */
  set(value) {
    deleteClasses("text", "mono", false);
    toClassesOnce("text", value ? "mono" : value, false);
  },
});
</script>
