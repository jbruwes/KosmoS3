<template lang="pug">
q-drawer(v-model="rightDrawer" bordered side="right")
  q-list
    q-expansion-item(group="group" icon="account_tree" label="Дерево рубрик" default-opened header-class="text-primary")
      q-btn-group.q-mx-xs(spread flat)
        q-btn(icon="note" @click="newPage")
        q-btn(icon="delete" @click="deletePage")
        q-btn(icon="chevron_left")
        q-btn(icon="chevron_right")
        q-btn(icon="expand_more")
        q-btn(icon="expand_less")
      q-tree.q-ma-xs(ref="tree" v-model:selected="selected" v-model:expanded="expanded" :nodes="content??[]" node-key="id" no-selection-unset accordion)
        template(#default-header="prop")
          .row.items-center(@dblclick="prop.node.edit=true")
            q-checkbox.q-mr-xs(v-model="prop.node.visible" dense)
            q-input(v-model="prop.node.label" dense :readonly="!prop.node.edit" outlined :bg-color="prop.node.id === selected? 'primary': undefined" @click.stop="selected=prop.node.id")
    q-separator
    q-expansion-item(group="group" icon="travel_explore" label="Настройки SEO" header-class="text-teal")
      q-card
        q-card-section Настройки SEO
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
import { get, isDefined, set, useArrayFind, whenever } from "@vueuse/core";
import DOMPurify from "dompurify";
import { html_beautify as htmlBeautify } from "js-beautify";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed, ref, watch } from "vue";

import VSourceCode from "@/components/VSourceCode.vue";
import VWysiwyg from "@/components/VWysiwyg.vue";
import contentStore from "@/stores/contentStore";

const $q = useQuasar();
const store = contentStore();
const { rightDrawer, content, selected, expanded, selectedObject, list } =
  storeToRefs(store);
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
 *
 */
const newPage = () => {
  const { parent, children, index } = get(selectedObject);
  const id = crypto.randomUUID();
  const visible = true;
  const label = "";
  const value = "";
  const page = { id, visible, label, value };
  if (parent) parent.children.splice(index + 1, 0, page);
  else children.unshift(page);
  set(selected, id);
};
/**
 *
 */
const deletePage = () => {
  const { parent, prev, next } = get(selectedObject) ?? {};
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
      parent.children = parent.children.filter(
        ({ id: pId }) => pId !== get(selected),
      );
      set(selected, id);
    });
};
watch(selected, (newVal, oldVal) => {
  const prevObj = useArrayFind(list, ({ id }) => id === oldVal);
  delete get(prevObj)?.edit;
});
</script>
