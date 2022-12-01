<template lang="pug">
v-container(fluid)
  .d-flex.flex-column.align-center.mb-4
    v-btn-toggle(group, variant="outlined", divided)
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
import VMargins from "./VMargins.vue";
import VPaddings from "./VPaddings.vue";
</script>
