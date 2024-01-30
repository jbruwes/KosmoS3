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
        q-list
          q-item(v-ripple, tag="label")
            q-item-section
              q-item-label Адаптивность
              q-item-label(caption) the.responsive
            q-item-section(avatar)
              q-toggle(v-model="selectedObject.responsive")
          q-item(v-ripple, tag="label")
            q-item-section
              q-item-label Показывать подложку
              q-item-label(caption) the.background
            q-item-section(avatar)
              q-toggle(v-model="selectedObject.background")
          q-item(v-ripple, tag="label")
            q-item-section
              q-item-label Затемнение подложки
              q-item-label(caption) the.overlay
            q-item-section(avatar)
              q-toggle(v-model="selectedObject.overlay")
        q-select(
          v-model="selectedObject.theme",
          label="Цветовая тема",
          :options="themes",
          hint="the.theme"
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
          label="Заголовок страницы",
          hint="the.title"
        )
        q-input(
          v-model.trim="selectedObject.description",
          type="textarea",
          autogrow,
          label="Описание страницы",
          hint="the.description"
        )
        q-select(
          v-model.trim="selectedObject.keywords",
          multiple,
          use-chips,
          use-input,
          new-value-mode="add",
          stack-label,
          hide-dropdown-icon,
          label="Ключевые слова",
          hint="the.keywords"
        )
        q-input(
          v-model.trim="loc",
          prefix="/",
          label="Постоянная ссылка",
          type="url",
          hint="the.loc"
        )
        q-select(
          v-model="selectedObject.changefreq",
          :options="changefreq",
          label="Частота обновления",
          clearable,
          hint="the.changefreq"
        )
        q-input(
          v-model.number="selectedObject.priority",
          label="Приоритет",
          type="number",
          min="0",
          max="1",
          step="0.1",
          hint="the.priority"
        )
        q-input(
          v-model.trim="selectedObject.icon",
          label="Иконка",
          clearable,
          hint="the.icon"
        )
          template(#prepend)
            q-icon.cursor-pointer(
              :name="selectedObject.icon ?? 'mdi-tray-arrow-up'"
            )
              q-popup-proxy.column.items-center.justify-center(
                v-model="data.showIconPicker"
              )
                q-input.q-ma-md(
                  v-model="data.filter",
                  label="Поиск...",
                  clearable,
                  dense
                )
                q-icon-picker(
                  v-model="selectedObject.icon",
                  v-model:model-pagination="data.pagination",
                  :filter="data.filter",
                  :icons="icons",
                  tooltips,
                  dense
                )
        q-img.q-mt-md.rounded-borders(
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
          .absolute-bottom.text-center the.image
        q-img.q-mt-md.rounded-borders(
          v-if="!selectedObject.image",
          :ratio="16 / 9"
        )
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
    q-tab(name="template", label="template")
    q-tab(name="script", label="script setup")
    q-tab(name="style", label="style scoped")
  q-separator
  q-tab-panels.full-width.col(v-model="state.content.tab")
    q-tab-panel.column(name="wysiwyg")
      v-wysiwyg.full-width.col.column
    q-tab-panel.column(name="template")
      v-source-code.col(v-model="selectedValue")
    q-tab-panel.column(name="script")
      v-source-code.col(v-model="selectedObject.script", lang="javascript")
    q-tab-panel.column(name="style")
      v-source-code.col(v-model="selectedObject.style", lang="css")
</template>
<script setup>
import materialIcons from "@quasar/quasar-ui-qiconpicker/src/components/icon-set/mdi-v6";
import { get, isDefined, useFileDialog, watchOnce } from "@vueuse/core";
import * as mime from "mime-types";
import { storeToRefs } from "pinia";
import { uid, useQuasar } from "quasar";
import { computed, reactive, ref, watch } from "vue";

import VInteractiveTree from "@/components/VInteractiveTree.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import VWysiwyg from "@/components/VWysiwyg.vue";
import storeApp from "@/stores/app";
import storeS3 from "@/stores/s3";

const $q = useQuasar();
const s3Store = storeS3();
const { state, content, flatTree, selectedValue, themes, selectedObject } =
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
const loc = computed({
  /** @returns {string} - Постоянная ссылка */
  get() {
    return get(selectedObject)?.loc;
  },
  /** @param {string} value - Новое значение постоянной ссылки */
  set(value) {
    get(selectedObject).loc = value.replace(/^\/|\/$/g, "");
  },
});
const data = ref({
  showIconPicker: false,
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
        get(selectedObject).image = `/${filePath}`;
      } else
        throw new Error(
          "Тип графического файла не подходит для использования в сети интернет",
        );
    } catch (err) {
      const { message } = err;
      $q.notify({ message });
    }
});
</script>
