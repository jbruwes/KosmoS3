<template lang="pug">
q-editor(:model-value="modelValue"  content-class="col" flat placeholder="Добавьте контент на вашу страницу..." @update:model-value="$emit('update:modelValue', $event)")
</template>

<script setup>
defineProps({ modelValue: { default: "", type: String } });
defineEmits(["update:modelValue"]);
</script>
