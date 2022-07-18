<template>
  <!--v-container>
    <v-row>
      <template v-for="(item, n) in items" :key="n">
        <v-col cols="12" :sm="col">
          <v-card-item-k3
            :item="item"
            :animate="animate"
            :class="class"
            :width="width"
            :height="height"
            :icon="icon"
            :date="date"
            :title="title"
            :image="image"
            :href="href"
            :description="description"
          ></v-card-item-k3>
        </v-col>
        <v-responsive
          v-if="n === 2"
          :key="`width-${n}`"
          width="100%"
        ></v-responsive>
      </template>
    </v-row>
  </v-container-->
  <v-container
    ><v-row v-for="chunk in itemChunks" justify="center"
      ><v-col v-for="item in chunk" cols="12" sm="6" md="4" lg="3" xl="2"
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
        ></v-card-item-k3></v-col></v-row
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
    height: Number,
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
    col() {
      let cols = ~~this.cols;
      if (this.cols > 4) cols = 4;
      if (this.cols < 2) cols = 2;
      return 12 / cols;
    },
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
