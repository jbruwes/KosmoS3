<template lang="pug">
q-btn-group.q-mx-xs(spread, flat)
  q-btn(icon="note", @click="newPage")
  q-btn(icon="delete", @click="deletePage")
  q-btn(v-if="nodes", icon="chevron_left", @click="leftPage")
  q-btn(v-if="nodes", icon="chevron_right", @click="rightPage")
  q-btn(icon="expand_more", @click="downPage")
  q-btn(icon="expand_less", @click="upPage")
.scroll.col
  q-tree.q-ma-xs(
    ref="tree",
    :selected="selected",
    :expanded="expanded",
    :nodes="nodes ?? list",
    node-key="id",
    no-selection-unset,
    accordion,
    @update:selected="$emit('update:selected', $event)",
    @update:expanded="$emit('update:expanded', $event)"
  )
    template(#default-header="prop")
      .row.no-wrap.full-width.items-center(@dblclick="prop.node.edit = true")
        q-checkbox.q-mr-xs(v-model="prop.node.visible", dense)
        q-input.min-w-96.full-width(
          v-model.trim="prop.node[type === 'text' ? 'label' : type]",
          dense,
          :readonly="!prop.node.edit",
          :type="type",
          outlined,
          :bg-color="prop.node.id === selected ? 'primary' : undefined",
          @click.stop="$emit('update:selected', prop.node.id)",
          @keyup.enter="delete prop.node.edit"
        )
</template>
<script setup>
import { get, useArrayFind, useArrayFindIndex } from "@vueuse/core";
import { uid, useQuasar } from "quasar";
import { ref, toRef, watch } from "vue";

const props = defineProps({
  selected: { default: "", type: String },
  type: { default: "text", type: String },
  expanded: {
    /** @returns {Array} - Пустой массив */
    default: () => [],
    type: Array,
  },
  nodes: { default: undefined, type: Array },
  list: {
    /** @returns {Array} - Пустой массив */
    default: () => [],
    type: Array,
  },
});
const emits = defineEmits(["update:expanded", "update:selected"]);
const $q = useQuasar();
const tree = ref();
const updateSelected = "update:selected";
const refList = toRef(props, "list");
const selectedObject = useArrayFind(refList, ({ id }) => id === props.selected);
const selectedObjectIndex = useArrayFindIndex(
  refList,
  ({ id }) => id === props.selected,
);
watch(selectedObject, (newVal, oldVal) => {
  const lOldVal = oldVal;
  delete lOldVal?.edit;
});
/** Добавление новой страницы */
const newPage = () => {
  const { parent, children, index, siblings } = get(selectedObject) ?? {};
  const id = uid();
  const visible = true;
  const page = { id, visible };
  switch (true) {
    case !!parent:
      siblings.splice(index + 1, 0, page);
      break;
    case !!children:
      children.unshift(page);
      break;
    default:
      refList.value.splice(get(selectedObjectIndex) + 1, 0, page);
      break;
  }
  emits(updateSelected, id);
};
/** Удаление текущей страницы */
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
      parent.children = siblings.filter(
        ({ id: pId }) => pId !== props.selected,
      );
      emits(updateSelected, id);
    });
};
/** Перемещение страницы вверх на одну позицию */
const upPage = () => {
  const { index, siblings } = get(selectedObject) ?? {};
  if (index)
    [siblings[index - 1], siblings[index]] = [
      siblings[index],
      siblings[index - 1],
    ];
};
/** Перемещение страницы вниз на одну позицию */
const downPage = () => {
  const { index, siblings } = get(selectedObject) ?? {};
  if (index < siblings.length - 1)
    [siblings[index], siblings[index + 1]] = [
      siblings[index + 1],
      siblings[index],
    ];
};
/** Перемещение страницы вправо на одну позицию */
const rightPage = () => {
  const { index, siblings, prev } = get(selectedObject) ?? {};
  if (prev) {
    const { children = [], id } = prev;
    prev.children = [...children, ...siblings.splice(index, 1)];
    get(tree).setExpanded(id, true);
  }
};
/** Перемещение страницы влево на одну позицию */
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
</script>
<style>
.min-w-96 {
  min-width: 96px;
}
</style>
