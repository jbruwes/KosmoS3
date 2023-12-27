<template lang="pug">
q-drawer(v-model="state.rightDrawer", bordered, side="right")
  q-list
    q-expansion-item(
      icon="account_tree",
      label="Дерево рубрик",
      default-opened,
      header-class="text-primary"
    )
      v-interactive-tree(
        v-model:selected="state.content.selected",
        v-model:expanded="state.content.expanded",
        :nodes="content",
        :list="flatTree",
        :selected-object="selectedObject"
      )
    q-separator
    q-card(v-if="selectedObject", flat)
      q-item.text-teal
        q-item-section(avatar)
          q-icon(name="travel_explore")
        q-item-section
          q-item-label Настройки слоя
      q-card-section
        q-toggle(v-model="selectedObject.responsive", label="Адаптивность")
        q-select(
          v-model="selectedObject.theme",
          label="Цветовая тема",
          :options="themes"
        )
          template(#prepend)
            q-icon(name="mdi-theme-light-dark")
    q-separator
    q-card(v-if="selectedObject", flat)
      q-item.text-teal
        q-item-section(avatar)
          q-icon(name="travel_explore")
        q-item-section
          q-item-label Настройки SEO
      q-card-section
        q-input(
          v-model.trim="selectedObject.title",
          label="Заголовок страницы"
        )
        q-input(
          v-model.trim="selectedObject.description",
          type="textarea",
          autogrow,
          label="Описание страницы"
        )
        q-select(
          v-model.trim="selectedObject.keywords",
          multiple,
          use-chips,
          use-input,
          new-value-mode="add",
          stack-label,
          hide-dropdown-icon,
          label="Ключевые слова"
        )
        q-input(
          v-model.trim="selectedObject.loc",
          label="Постоянная ссылка",
          type="url"
        )
        q-select(
          v-model="selectedObject.changefreq",
          :options="changefreq",
          label="Частота обновления",
          clearable
        )
        q-input(
          v-model.number="selectedObject.priority",
          label="Приоритет",
          type="number",
          min="0",
          max="1",
          step="0.1"
        )
        q-input(v-model.trim="selectedObject.icon", clearable, label="Иконка")
          template(#prepend)
            q-icon(v-if="selectedObject.icon", :name="selectedObject.icon")
        q-icon-picker.q-my-md(
          v-model="selectedObject.icon",
          v-model:model-pagination="data.pagination",
          :icons="icons",
          :filter="data.filter",
          style="height: 400px",
          dense,
          tooltips
        )
        q-img.rounded-borders(
          v-if="selectedObject.image",
          :src="`${base}${selectedObject.image}`",
          :ratio="16 / 9"
        )
          q-btn.all-pointer-events.absolute(
            size="xs",
            icon="close",
            round,
            color="white",
            text-color="black",
            dense,
            style="top: 8px; right: 8px",
            @click="delete selectedObject.image"
          )
        q-img.rounded-borders(v-if="!selectedObject.image", :ratio="16 / 9")
          .absolute-full.flex-center.flex
            q-btn(label="Загрузить картинку", color="primary", @click="open")
q-page.column.full-height
  q-tabs.text-grey(
    v-model="state.content.tab",
    dense,
    active-color="primary",
    indicator-color="primary",
    align="justify",
    narrow-indicator
  )
    q-tab(name="wysiwyg", label="wysiwyg")
    q-tab(name="source", label="source")
  q-separator
  q-tab-panels.full-width.col(v-model="state.content.tab")
    q-tab-panel.column(name="wysiwyg")
      v-wysiwyg.full-width.col.column
    q-tab-panel.column(name="source")
      v-source-code.col(v-model="selectedValue")
</template>
<script setup>
import materialIcons from "@quasar/quasar-ui-qiconpicker/src/components/icon-set/mdi-v6";
import { get, isDefined, useFileDialog, watchOnce } from "@vueuse/core";
import * as mime from "mime-types";
import { storeToRefs } from "pinia";
import { uid, useQuasar } from "quasar";
import { reactive, ref, watch } from "vue";

import VInteractiveTree from "@/components/VInteractiveTree.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import VWysiwyg from "@/components/VWysiwyg.vue";
import storeApp from "@/stores/app";
import storeS3 from "@/stores/s3";

const $q = useQuasar();
const s3Store = storeS3();
const { state, content, flatTree, selectedObject, selectedValue } =
  storeToRefs(storeApp());
const { base } = storeToRefs(s3Store);
const { putFile } = s3Store;
const changefreq = reactive([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);
const icons = ref(materialIcons.icons);
const data = ref({
  filter: "",
  pagination: {
    itemsPerPage: 75,
    page: 0,
  },
});
get(state).rightDrawer = true;
/** Инициализация */
const init = () => {
  const { id } = get(content, 0);
  const {
    content: { expanded, selected },
  } = get(state);
  if (!expanded.length) get(state).content.expanded = [id];
  if (!selected) get(state).content.selected = id;
};
if (isDefined(content)) init();
else watchOnce(content, init);
const { files, open } = useFileDialog({
  multiple: false,
  accept: "image/*",
  capture: "Выберите картинку",
  reset: true,
});
watch(files, async (newFiles) => {
  const [file] = newFiles ?? [];
  if (file)
    try {
      const { type } = file;
      if (
        [
          "image/apng",
          "image/avif",
          "image/gif",
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/webp",
        ].includes(type)
      ) {
        const filePath = `images/${uid()}.${mime.extension(type)}`;
        await putFile(filePath, type, file);
        get(selectedObject).image = filePath;
      } else
        throw new Error(
          "Тип графического файла не подходит для использования в сети интернет",
        );
    } catch (err) {
      const { message } = err;
      $q.notify({ message });
    }
});
const themes = reactive([
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
]);
</script>
