<template lang="pug">
q-drawer(v-model="state.rightDrawer", bordered, side="right")
  q-card(flat)
    q-item.text-teal
      q-item-section(avatar)
        q-icon(name="travel_explore")
      q-item-section
        q-item-label Настройки панели навигации
    q-card-section
      q-select(
        v-model="navbar.theme",
        label="Цветовая тема",
        :options="themes"
      )
        template(#prepend)
          q-icon(name="mdi-theme-light-dark")
      q-select(
        v-model.trim="navbar.classes",
        multiple,
        use-chips,
        use-input,
        new-value-mode="add",
        stack-label,
        hide-dropdown-icon,
        label="Классы навигатора"
      )
q-page.column.full-height
  q-tabs.text-grey(
    v-model="navbarTabs",
    dense,
    active-color="primary",
    indicator-color="primary",
    align="justify",
    narrow-indicator
  )
    q-tab(name="template", label="template")
    q-tab(name="script", label="script setup")
    q-tab(name="style", label="style scoped")
  q-separator
  q-tab-panels.full-width.col(v-model="navbarTabs")
    q-tab-panel.column(name="template")
      v-source-code.col(v-model="navbar.template")
    q-tab-panel.column(name="script")
      v-source-code.col(v-model="navbar.script", lang="javascript")
    q-tab-panel.column(name="style")
      v-source-code.col(v-model="navbar.style", lang="css")
</template>
<script setup>
import { get, useStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";

import themes from "@/assets/themes.json";
import VSourceCode from "@/components/VSourceCode.vue";
import app from "@/stores/app";
import data from "~/monolit/src/stores/data";

const { state } = storeToRefs(app());
const { navbar } = storeToRefs(data());
const navbarTabs = useStorage("navbar-tabs", "template");
get(state).rightDrawer = true;
</script>
