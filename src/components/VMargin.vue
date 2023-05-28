<template lang="pug">
v-sheet
  .v-label margin
  .d-flex
    .flex-fill(v-for="(value, name, index) in margins", :key="index")
      v-radio-group(
        v-if="value",
        v-model="value.type",
        density="compact",
        hide-details
      )
        v-radio.align-end(
          density="compact",
          :true-icon="value.icon",
          :value="2"
        )
          template(#label)
            v-text-field(
              v-if="value",
              v-model="value.size",
              min="-16",
              max="16",
              step="1",
              type="number",
              density="compact",
              hide-details,
              @input="(event) => { value.size = event.target.value || 0; }",
              @focus="value.type = 2"
            )
        v-radio(
          label="auto",
          density="compact",
          :true-icon="value.icon",
          :value="1"
        )
        v-radio(
          label="none",
          density="compact",
          :true-icon="value.icon",
          :value="0"
        )
</template>

<script setup>
import { computed } from "vue";
import template3 from "@/store/template3";

const localStore = template3();
const { cmpSizeType } = localStore;
const margins = computed(() =>
  Object.fromEntries(
    Object.entries({
      ml: {
        icon: "mdi-arrow-left-circle-outline",
      },
      mr: {
        icon: "mdi-arrow-right-circle-outline",
      },
      mt: {
        icon: "mdi-arrow-up-circle-outline",
      },
      mb: {
        icon: "mdi-arrow-down-circle-outline",
      },
    }).map(([k, v]) => [
      k,
      cmpSizeType(
        k,
        v,
        {
          ma: ["mt", "mb", "ml", "mr"],
          mx: ["ml", "mr"],
          my: ["mt", "mb"],
          mt: ["mt"],
          mb: ["mb"],
          ml: ["ml"],
          mr: ["mr"],
        },
        "(auto|\\bn?([0-9]|1[0-6])\\b)"
      ),
    ])
  )
);
</script>
