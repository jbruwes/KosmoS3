<template>
  <v-container class="bg-surface-variant"
    ><v-row no-gutters v-for="chunk in itemChunks"
      ><v-col v-for="item in chunk" cols="12" sm="3"
        ><v-sheet class="ma-2 pa-2"
          ><v-card-item-k3
            :item="item"
            :animate="animate"
            :class="class"
            :width="width || '100%'"
            :icon="icon"
            :date="date"
            :title="title"
            :image="image"
            :href="href"
            :description="description"
          ></v-card-item-k3></v-sheet></v-col></v-row
  ></v-container>

  <!--v-container>
    <v-row v-for="chunk in itemChunks" no-gutters>
      <v-col v-for="item in chunk" cols="12">
        <v-card-item-k3
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
        ></v-card-item-k3>
      </v-col>
    </v-row>
  </v-container-->
</template>
<script>
import _ from "lodash";
import { mapActions } from "pinia";
import core from "../stores/core.js";
import VCardItemK3 from "./VCardItemK3.vue";
export default {
  props: {
    path: String,
    animate: String,
    class: String,
    width: Number,
    icon: String,
    date: String,
    title: String,
    image: String,
    href: String,
    description: String,
  },
  components: { VCardItemK3 },
  computed: {
    items() {
      return this.getItems(null, null, null, null, this.path, null, "*");
    },
    itemChunks() {
      return _.chunk(Object.values(this.items), 4);
    },
  },
  methods: { ...mapActions(core, ["getItems"]) },
};
</script>
