<template lang="pug">
q-drawer(v-model="rightDrawer", bordered, side="right")
  q-list
    q-expansion-item(
      icon="account_tree",
      label="Дерево рубрик",
      default-opened,
      header-class="text-primary"
    )
      v-interactive-tree(
        v-model:selected="selected",
        v-model:expanded="expanded",
        :nodes="content",
        :list="list"
      )
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
          v-if="selectedObject.img",
          :src="`${base}${selectedObject.img}`",
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
            @click="delete selectedObject.img"
          )
        q-img.rounded-borders(v-if="!selectedObject.img", :ratio="16 / 9")
          .absolute-full.flex-center.flex
            q-btn(label="Загрузить картинку", color="primary", @click="open")
q-page.column.full-height
  q-tabs.text-grey(
    v-model="tab",
    dense,
    active-color="primary",
    indicator-color="primary",
    align="justify",
    narrow-indicator
  )
    q-tab(name="wysiwyg", label="wysiwyg")
    q-tab(name="source", label="source")
  q-separator
  q-tab-panels.full-width.col(v-model="tab")
    q-tab-panel.column(name="wysiwyg")
      v-wysiwyg.full-width.col.column(v-model="selectedValue")
    q-tab-panel.column(name="source")
      v-source-code.col(v-model="selectedValue")
</template>
<script setup>
import materialIcons from "@quasar/quasar-ui-qiconpicker/src/components/icon-set/mdi-v6";
import { get, isDefined, set, useFileDialog, whenever } from "@vueuse/core";
import * as mime from "mime-types";
import { storeToRefs } from "pinia";
import { uid, useQuasar } from "quasar";
import { computed, reactive, ref, watch } from "vue";

import VInteractiveTree from "@/components/VInteractiveTree.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import VWysiwyg from "@/components/VWysiwyg.vue";
import storeApp from "@/stores/app";
import storeContent from "@/stores/content";

const $q = useQuasar();
const appStore = storeApp();
const { rightDrawer, base } = storeToRefs(appStore);
const { putFile } = appStore;
const { content, selected, expanded, selectedObject, list } = storeToRefs(
  storeContent(),
);
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
set(rightDrawer, true);
const tab = ref("wysiwyg");
const selectedValue = computed({
  /**
   * Считывание исходного кода из структуры данных
   *
   * @returns {string} - Html
   */
  get() {
    const { html = "" } = get(selectedObject) ?? {};
    return html.replace(/src="([^"]+)"/gi, (match, p1) => {
      const { href } = new URL(p1, get(base));
      return `src="${href}"`;
    });
  },
  /**
   * Запись исходного кода страницы в структуры данных
   *
   * @param {string} value - Html
   */
  set(value) {
    const regexp = new RegExp(`^${get(base)}`);
    get(selectedObject).html = value.replace(
      /src="([^"]+)"/gi,
      (match, p1) => `src="${p1.replace(regexp, "")}"`,
    );
    get(selectedObject).lastmod = new Date().toISOString();
  },
});
/** Инициализация */
const init = () => {
  const { id } = get(content, 0);
  set(expanded, [id]);
  set(selected, id);
};
if (isDefined(content)) init();
else whenever(content, init);
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
        get(selectedObject).img = filePath;
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
