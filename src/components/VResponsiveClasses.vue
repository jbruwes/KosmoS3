<template lang="pug">
v-container(fluid)
  .d-flex.flex-column.align-center.mb-4
    v-btn-toggle(
      v-model="breakpoint",
      group,
      variant="outlined",
      divided,
      color="primary"
    )
      v-btn(value="xs", size="small") xs
      v-btn(value="sm", size="small") sm
      v-btn(value="md", size="small") md
      v-btn(value="lg", size="small") lg
      v-btn(value="xl", size="small") xl
  v-select.mt-4(
    v-model="display",
    :items="displays",
    label="display",
    clearable
  )
  | margin
  v-margins
  v-divider.my-4
  | padding
  v-paddings
  v-divider.my-4
</template>

<script setup>
import { computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import { get, isDefined } from "@vueuse/core";
import template3 from "@/stores/template3";
import VMargins from "./VMargins.vue";
import VPaddings from "./VPaddings.vue";

const localStore = template3();
const { breakpoint, item } = storeToRefs(localStore);
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
  /** @returns {string} значение параметра */
  get() {
    const k = "d";
    const key = `${k}-${get(breakpoint) || ""}`.replace(/-$/, "");
    const mask = `(${displays.join("|")})`;
    return (
      isDefined(item)
        ? get(item).classes.find((element) =>
            new RegExp(`^${key}-${mask}$`).test(element)
          ) || ""
        : ""
    ).replace(new RegExp(`^${key}-`), "");
  },
  /** @param {string} value значение параметра */
  set(value) {
    const k = "d";
    const key = `${k}-${get(breakpoint) || ""}`.replace(/-$/, "");
    const mask = `(${displays.join("|")})`;
    get(item).classes = get(item).classes.filter(
      (aclass) => !new RegExp(`^${key}-${mask}$`).test(aclass)
    );
    if (value) get(item).classes.push(`${key}-${value}`);
  },
});
</script>
