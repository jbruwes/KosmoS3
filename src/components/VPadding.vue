<template lang="pug">
v-sheet
  .v-label padding
  .d-flex
    .flex-fill(v-for="(value, name, index) in paddings", :key="index")
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
              min="0",
              max="16",
              step="1",
              type="number",
              density="compact",
              hide-details,
              @input="(event) => { value.size = event.target.value || 0; }",
              @focus="value.type = 2"
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
const paddings = computed(() =>
  Object.fromEntries(
    Object.entries({
      pl: {
        icon: "mdi-arrow-left-circle-outline",
      },
      pr: {
        icon: "mdi-arrow-right-circle-outline",
      },
      pt: {
        icon: "mdi-arrow-up-circle-outline",
      },
      pb: {
        icon: "mdi-arrow-down-circle-outline",
      },
    }).map(([k, v]) => [
      k,
      cmpSizeType(
        k,
        v,
        {
          pa: ["pt", "pb", "pl", "pr"],
          px: ["pl", "pr"],
          py: ["pt", "pb"],
          pt: ["pt"],
          pb: ["pb"],
          pl: ["pl"],
          pr: ["pr"],
        },
        "\\b([0-9]|1[0-6])\\b"
      ),
    ])
  )
);
</script>
