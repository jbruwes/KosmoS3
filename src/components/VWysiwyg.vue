<template lang="pug">
q-editor(:model-value="modelValue"  content-class="col" flat placeholder="Добавьте контент на вашу страницу..." @update:model-value="$emit('update:modelValue', $event)" @paste="pasteCapture" @drop="dropCapture")
</template>

<script setup>
defineProps({ modelValue: { default: "", type: String } });
defineEmits(["update:modelValue"]);
/**
 * { @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types }
 * @param {object} evt - объект события
 */
const pasteCapture = (evt) => {
  const clipboardData =
    evt?.originalEvent?.clipboardData ||
    evt?.clipboardData ||
    window?.clipboardData;

  if (!clipboardData.getData("text")) {
    evt.preventDefault();
    evt.stopPropagation();
    const { items = [] } = clipboardData;
    for (let i = 0; i < items.length; i += 1) {
      if (
        [
          "image/apng",
          "image/avif",
          "image/gif",
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/webp",
        ].includes(items[i].type)
      )
        console.log("image");
      // var blob = items[i].getAsFile();
    }
  }
};
/**
 *
 * @param evt
 */
const dropCapture = (evt) => {
  // evt.preventDefault();
  // evt.stopPropagation();
  console.log("dropCapture", evt);
};
</script>
