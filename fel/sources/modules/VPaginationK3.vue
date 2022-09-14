<template>
  <v-pagination v-model="itemIndex" :length="itemsLength" :total-visible="7">
  </v-pagination>
</template>
<script>
import { storeToRefs } from "pinia";
import { ref, computed, watch } from "vue";
import { get, set } from "@vueuse/core";
import page from "page";
import core from "~/core.js";
export default {
  props: {
    variant: String,
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: { default: undefined, type: Boolean },
    xpath: { default: "*/*[@id]", type: String },
    axe: { default: "parent", type: String },
  },
  setup(props) {
    const store = core();
    const { id } = storeToRefs(store);
    const { getItems, getHref } = store;
    const itemIndex = ref(0);
    const items = computed(() => {
      let ret = getItems(
        props.deep,
        props.length,
        props.reveal,
        props.sort,
        props.path,
        props.children,
        props.xpath,
        props.axe
      );
      if (!ret.length)
        ret = getItems(
          props.deep,
          props.length,
          props.reveal,
          props.sort,
          props.path,
          props.children,
          "*[@id]",
          "self"
        );
      const index = 1 + ret.findIndex((e) => e.id === get(id));
      if (index) set(itemIndex, index);
      return ret;
    });
    const itemsLength = computed(() => get(items).length);
    watch(itemIndex, (newIndex, oldIndex) => {
      if (oldIndex) page(getHref(get(items)[newIndex - 1]));
    });
    return { itemIndex, itemsLength };
  },
};
</script>
