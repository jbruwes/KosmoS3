<template><div>CssView</div></template>
<script setup>
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";

const store = kosmos3();
const { panel } = storeToRefs(store);
set(panel, null);
</script>
