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
  | margin
  v-margins
  v-divider.my-4
  | padding
  v-paddings
  v-divider.my-4
</template>

<script setup>
import { storeToRefs } from "pinia";
import template3 from "@/stores/template3";
import VMargins from "./VMargins.vue";
import VPaddings from "./VPaddings.vue";

const localStore = template3();
const { breakpoint } = storeToRefs(localStore);
</script>
