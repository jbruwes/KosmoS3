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
      q-select(
        v-model.trim="navbar.scroll.classes",
        multiple,
        use-chips,
        use-input,
        new-value-mode="add",
        stack-label,
        hide-dropdown-icon,
        label="Скролл классы"
      )
      q-btn.full-width.q-ma-md(
        outline,
        rounded,
        color="primary",
        icon="sync",
        @click="fncResetNavbar"
      ) Сброс параметров
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
import { css, html, js } from "js-beautify";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";

import defNavbar from "@/assets/navbar.json";
import themes from "@/assets/themes.json";
import VSourceCode from "@/components/VSourceCode.vue";
import app from "@/stores/app";
import data from "~/monolit/src/stores/data";

const $q = useQuasar();
const { state } = storeToRefs(app());
const { navbar } = storeToRefs(data());
const navbarTabs = useStorage("navbar-tabs", "template");
get(state).rightDrawer = true;

/** Сброс параметров навбара */
const fncResetNavbar = () => {
  $q.dialog({
    title: "Сброс навбара",
    message: "Выбор сбрасываемых параметров:",
    options: {
      type: "checkbox",
      model: [],
      items: [
        { label: "Шаблон", value: "template" },
        { label: "Скрипты", value: "script" },
        { label: "Стили", value: "style" },
        { label: "Тема", value: "theme" },
        { label: "Классы", value: "classes" },
        { label: "Скролл классы", value: "scrollClasses" },
      ],
    },
    cancel: true,
    persistent: true,
  }).onOk((value) => {
    value.forEach((element) => {
      switch (element) {
        case "template":
          get(navbar)[element] = html(defNavbar[element]);
          break;
        case "script":
          get(navbar)[element] = js(defNavbar[element]);
          break;
        case "style":
          get(navbar)[element] = css(defNavbar[element]);
          break;
        case "scrollClasses":
          get(navbar).scroll.classes = defNavbar.scroll.classes;
          break;
        default:
          get(navbar)[element] = defNavbar[element];
      }
    });
  });
};
</script>
