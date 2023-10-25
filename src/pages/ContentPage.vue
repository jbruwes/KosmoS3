<template lang="pug">
q-drawer(v-model="rightDrawer" bordered side="right")
  q-list
    q-expansion-item(icon="account_tree" label="Дерево рубрик" default-opened header-class="text-primary")
      q-btn-group.q-mx-xs(spread flat)
        q-btn(icon="note" @click="newPage")
        q-btn(icon="delete" @click="deletePage")
        q-btn(icon="chevron_left" @click="leftPage")
        q-btn(icon="chevron_right" @click="rightPage")
        q-btn(icon="expand_more" @click="downPage")
        q-btn(icon="expand_less" @click="upPage")
      .scroll
        q-tree.q-ma-xs(ref="tree" v-model:selected="selected" v-model:expanded="expanded" :nodes="content??[]" node-key="id" no-selection-unset accordion)
          template(#default-header="prop")
            .row.items-center.no-wrap(@dblclick="prop.node.edit=true")
              q-checkbox.q-mr-xs(v-model="prop.node.visible" dense)
              q-input.min-w-96(v-model.trim="prop.node.label" dense :readonly="!prop.node.edit" outlined :bg-color="prop.node.id === selected? 'primary': undefined" @click.stop="selected=prop.node.id" @keyup.enter="delete prop.node.edit")
    q-separator
    q-card(flat)
      q-item.text-teal
        q-item-section(avatar)
          q-icon(name="travel_explore")
        q-item-section
          q-item-label Настройки SEO
      q-card-section
        q-input(v-model.trim="selectedObject.title" label="Заголовок страницы")
        q-input(v-model.trim="selectedObject.description" type="textarea" autogrow label="Описание страницы")
        q-select(v-model.trim="selectedObject.keywords" multiple use-chips use-input new-value-mode="add" stack-label hide-dropdown-icon label="Ключевые слова")
        q-input(v-model.trim="selectedObject.loc" label="Постоянная ссылка" type="url")
        q-input(v-model="selectedObject.lastmod" label="Последнее изменение" type="date")
        q-select(v-model="selectedObject.changefreq" :options="changefreq" label="Частота обновления" clearable)
        q-input(v-model.number="selectedObject.priority" label="Приоритет" type="number" min="0" max="1" step="0.1")
        q-icon-picker(v-model="selectedObject.icon" v-model:model-pagination="data.pagination" :icons="icons" :filter="data.filter" style="height: 500px;" tooltips)
q-page.column.full-height
  q-tabs(v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator)
    q-tab(name="wysiwyg" label="wysiwyg")
    q-tab(name="source" label="source")
  q-separator
  q-tab-panels.full-width.col(v-model="tab")
    q-tab-panel.column(name="wysiwyg")
      v-wysiwyg.full-width.col.column(v-model="selectedValue")
    q-tab-panel.column(name="source")
      v-source-code.col(v-model="source")
</template>
<script setup>
import materialIcons from "@quasar/quasar-ui-qiconpicker/src/components/icon-set/material-icons";
import { get, isDefined, set, useArrayFind, whenever } from "@vueuse/core";
import DOMPurify from "dompurify";
import { html_beautify as htmlBeautify } from "js-beautify";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed, reactive, ref, watch } from "vue";

import VSourceCode from "@/components/VSourceCode.vue";
import VWysiwyg from "@/components/VWysiwyg.vue";
import storeApp from "@/stores/app";
import storeContent from "@/stores/content";

const $q = useQuasar();
const { rightDrawer } = storeToRefs(storeApp());
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
const tree = ref();
const configDOMPurify = {
  SAFE_FOR_TEMPLATES: true,
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["target", "allow", "allowfullscreen", "frameborder", "scrolling"],
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: /^v-/,
    attributeNameCheck: /\w+/,
    allowCustomizedBuiltInElements: true,
  },
};
const selectedValue = computed({
  /**
   * Считывание исходного кода из структуры данных
   * @returns {string} - html
   */
  get() {
    const { value = "" } = get(selectedObject) ?? {};
    return value;
  },
  /**
   * Запись исходного кода страницы в структуры данных
   * @param {string} value - html
   */
  set(value) {
    get(selectedObject).value = DOMPurify.sanitize(value, configDOMPurify);
  },
});
const source = computed({
  /**
   * Прихорашивание html
   * @returns {string} - красивый исходный код
   */
  get() {
    return htmlBeautify(get(selectedValue));
  },
  /**
   *
   * @param {string} newValue - отредактрованное значение
   */
  set(newValue) {
    set(selectedValue, newValue);
  },
});
/**
 *
 */
const init = () => {
  const { id } = get(content, 0);
  set(expanded, [id]);
  set(selected, id);
};
if (isDefined(content)) init();
else whenever(content, init);
/**
 * Добавление новой страницы
 */
const newPage = () => {
  const { parent, children, index, siblings } = get(selectedObject);
  const id = crypto.randomUUID();
  const visible = true;
  const label = "";
  const value = "";
  const page = { id, visible, label, value };
  if (parent) siblings.splice(index + 1, 0, page);
  else children.unshift(page);
  set(selected, id);
};
/**
 * Удаление текущей страницы
 */
const deletePage = () => {
  const { parent, prev, next, siblings } = get(selectedObject) ?? {};
  if (parent)
    $q.dialog({
      title: "Подтверждение",
      message: "Вы действительно хотите удалить эту и все дочерние страницы?",
      cancel: true,
      persistent: true,
    }).onOk(() => {
      let id;
      switch (true) {
        case !!next:
          ({ id } = next);
          break;
        case !!prev:
          ({ id } = prev);
          break;
        default:
          ({ id } = parent);
      }
      parent.children = siblings.filter(({ id: pId }) => pId !== get(selected));
      set(selected, id);
    });
};
/**
 * Перемещение страницы вверх на одну позицию
 */
const upPage = () => {
  const { index, siblings } = get(selectedObject) ?? {};
  if (index)
    [siblings[index - 1], siblings[index]] = [
      siblings[index],
      siblings[index - 1],
    ];
};
/**
 * Перемещение страницы вниз на одну позицию
 */
const downPage = () => {
  const { index, siblings } = get(selectedObject) ?? {};
  if (index < siblings.length - 1)
    [siblings[index], siblings[index + 1]] = [
      siblings[index + 1],
      siblings[index],
    ];
};
/**
 * Перемещение страницы вправо на одну позицию
 */
const rightPage = () => {
  const { index, siblings, prev } = get(selectedObject) ?? {};
  if (prev) {
    const { children = [], id } = prev;
    prev.children = [...children, ...siblings.splice(index, 1)];
    get(tree).setExpanded(id, true);
  }
};
/**
 * Перемещение страницы влево на одну позицию
 */
const leftPage = () => {
  const {
    index,
    parent: { index: parIndex, parent, siblings, children, id } = {},
  } = get(selectedObject) ?? {};
  if (parent) {
    get(tree).setExpanded(id, false);
    siblings.splice(parIndex + 1, 0, ...children.splice(index, 1));
  }
};
watch(selected, (newVal, oldVal) => {
  const prevObj = useArrayFind(list, ({ id }) => id === oldVal);
  delete get(prevObj)?.edit;
});
</script>
<style>
.min-w-96 {
  min-width: 96px;
}
</style>
