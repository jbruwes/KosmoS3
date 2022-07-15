<template>
  <v-container
    ><v-row no-gutters v-for="chunk in itemChunks" class="flex-nowrap"
      ><v-spacer v-if="chunk.length < cols"></v-spacer
      ><v-col v-for="item in chunk" class="ma-2"
        ><v-card-item-k3
          class="fill-height"
          :item="item"
          :animate="animate"
          :class="class"
          :width="width"
          :icon="icon"
          :date="date"
          :title="title"
          :image="image"
          :href="href"
          :description="description"
        ></v-card-item-k3></v-col
      ><v-spacer v-if="chunk.length < cols"></v-spacer></v-row
  ></v-container>
</template>
<script>
import _ from "lodash";
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VCardItemK3 from "./VCardItemK3.vue";
export default {
  props: {
    animate: String,
    class: String,
    width: { default: "100%", type: Number },
    icon: String,
    date: String,
    title: String,
    image: String,
    href: String,
    description: String,
    cols: { default: 4, type: Number },
    deep: Boolean,
    length: Number,
    reveal: Boolean,
    sort: String,
    path: String,
    children: Boolean,
  },
  components: { VCardItemK3 },
  computed: {
    items() {
      return this.getItems(
        this.deep,
        this.length,
        this.reveal,
        this.sort,
        this.path,
        this.children,
        "*[@id]"
      );
    },
    itemChunks() {
      return _.chunk(Object.values(this.items), this.cols);
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
