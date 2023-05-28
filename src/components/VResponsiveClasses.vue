<template lang="pug">
.d-flex.flex-column.align-center.my-4
  v-btn-toggle(
    v-model="breakpoint",
    group,
    variant="outlined",
    divided,
    color="primary"
  )
    v-btn(value="xs", size="small", density="compact") xs
    v-btn(value="sm", size="small", density="compact") sm
    v-btn(value="md", size="small", density="compact") md
    v-btn(value="lg", size="small", density="compact") lg
    v-btn(value="xl", size="small", density="compact") xl
    v-btn(value="xxl", size="small", density="compact") xxl
v-expansion-panels(v-model="panel", variant="accordion", mandatory)
  v-expansion-panel(title="common classes", :value="0")
    v-expansion-panel-text
      v-select.mt-4(
        v-model="display",
        :items="displays",
        label="display",
        clearable
      )
      v-select(v-model="float", :items="floats", label="float", clearable)
      v-select(
        v-model="textAlign",
        :items="textAligns",
        label="text align",
        clearable
      )
      v-select(
        v-model="textFormat",
        :items="textFormats",
        label="text format",
        clearable
      )
      v-margin
      v-divider.my-4
      v-padding.mb-4
  v-expansion-panel(title="flex classes", :value="1")
    v-expansion-panel-text
      v-select.mt-4(
        v-model="direction",
        :items="directions",
        label="direction",
        clearable
      )
      v-select(v-model="wrap", :items="wraps", label="wrap", clearable)
      v-select(
        v-model="justify",
        :items="justifies",
        label="justify",
        clearable
      )
      v-select(v-model="align", :items="aligns", label="align", clearable)
      v-select(
        v-model="alignContent",
        :items="alignsContent",
        label="align content",
        clearable
      )
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import template3 from "@/store/template3";
import VMargin from "./VMargin.vue";
import VPadding from "./VPadding.vue";

const localStore = template3();
const { breakpoint } = storeToRefs(localStore);
const { fromClassesOnce, toClassesOnce, deleteClasses } = localStore;
const panel = ref(0);
const displays = reactive([
  "none",
  "inline",
  "inline-block",
  "block",
  "table",
  "table-row",
  "table-cell",
  "flex",
  "inline-flex",
]);
const display = computed({
  /** @returns {string} значение display */
  get() {
    return fromClassesOnce("d", `(${displays.join("|")})`);
  },
  /** @param {string} value значение display */
  set(value) {
    deleteClasses("d", `(${displays.join("|")})`);
    toClassesOnce("d", value);
  },
});
const floats = reactive(["none", "left", "right"]);
const float = computed({
  /** @returns {string} значение float */
  get() {
    return fromClassesOnce("float", `(${floats.join("|")})`);
  },
  /** @param {string} value значение float */
  set(value) {
    deleteClasses("float", `(${floats.join("|")})`);
    toClassesOnce("float", value);
  },
});
const directions = reactive(["row", "column", "row-reverse", "column-reverse"]);
const direction = computed({
  /** @returns {string} значение direction */
  get() {
    return fromClassesOnce("flex", `(${directions.join("|")})`);
  },
  /** @param {string} value значение direction */
  set(value) {
    deleteClasses("flex", `(${directions.join("|")})`);
    toClassesOnce("flex", value);
  },
});
const wraps = reactive(["wrap", "nowrap", "wrap-reverse"]);
const wrap = computed({
  /** @returns {string} значение wrap */
  get() {
    return fromClassesOnce("flex", `(${wraps.join("|")})`);
  },
  /** @param {string} value значение wrap */
  set(value) {
    deleteClasses("flex", `(${wraps.join("|")})`);
    toClassesOnce("flex", value);
  },
});
const justifies = reactive([
  "start",
  "end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
]);
const justify = computed({
  /** @returns {string} значение justify */
  get() {
    return fromClassesOnce("justify", `(${justifies.join("|")})`);
  },
  /** @param {string} value значение justify */
  set(value) {
    deleteClasses("justify", `(${justifies.join("|")})`);
    toClassesOnce("justify", value);
  },
});
const aligns = reactive(["start", "end", "center", "baseline", "stretch"]);
const align = computed({
  /** @returns {string} значение align */
  get() {
    return fromClassesOnce("align", `(${aligns.join("|")})`);
  },
  /** @param {string} value значение align */
  set(value) {
    deleteClasses("align", `(${aligns.join("|")})`);
    toClassesOnce("align", value);
  },
});
const alignsContent = reactive([
  "start",
  "end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
  "stretch",
]);
const alignContent = computed({
  /** @returns {string} значение alignContent */
  get() {
    return fromClassesOnce("align-content", `(${alignsContent.join("|")})`);
  },
  /** @param {string} value значение alignContent */
  set(value) {
    deleteClasses("align-content", `(${alignsContent.join("|")})`);
    toClassesOnce("align-content", value);
  },
});
const textAligns = reactive([
  "left",
  "right",
  "center",
  "justify",
  "start",
  "end",
]);
const textAlign = computed({
  /** @returns {string} значение textAlign */
  get() {
    return fromClassesOnce("text", `(${textAligns.join("|")})`);
  },
  /** @param {string} value значение textAlign */
  set(value) {
    deleteClasses("text", `(${textAligns.join("|")})`);
    toClassesOnce("text", value);
  },
});
const textFormats = reactive([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle-1",
  "subtitle-2",
  "body-1",
  "body-2",
  "button",
  "caption",
  "overline",
]);
const textFormat = computed({
  /** @returns {string} значение textFormat */
  get() {
    return fromClassesOnce("text", `(${textFormats.join("|")})`);
  },
  /** @param {string} value значение textFormat */
  set(value) {
    deleteClasses("text", `(${textFormats.join("|")})`);
    toClassesOnce("text", value);
  },
});
</script>
