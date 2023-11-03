<template lang="pug">
q-btn-group.q-ma-xs(flat)
  q-btn(icon="note")
  q-btn(icon="delete")
  q-btn(icon="expand_more")
  q-btn(icon="expand_less")
.scroll
  q-list
    q-item(
      v-for="item in props.modelValue",
      :key="item.url",
      v-bind="item",
      clickable
    )
      q-item-section
        q-item-label {{ item.title }}
</template>
<script setup>
const props = defineProps({
  modelValue: {
    /** @returns {Array} - Пустой массив */
    default: () => [],
    type: Array,
  },
});
</script>
