<template lang="pug">
v-navigation-drawer(
  v-model="panel",
  location="right",
  :width="320",
  :temporary="mobile"
)
  v-tabs(v-model="drawer", :grow="true", stacked)
    v-tab(value="1")
      v-icon mdi-format-list-bulleted-square
    v-tab(value="2")
      v-icon mdi-move-resize
    v-tab(value="3")
      v-icon mdi-card-bulleted-settings-outline
  v-window(v-model="drawer")
    v-window-item(value="1")
      v-container.h-100.pa-0(fluid)
        v-form(ref="form")
          v-list
            draggable(v-model="template", item-key="id")
              template(#item="{ element, index }")
                v-list-item.px-1.py-0(
                  :value="element.id",
                  :active="element.id === id",
                  @click="clickRect(index)",
                  @blur="element.edit = false"
                )
                  template(#prepend)
                    v-list-item-action
                      v-checkbox-btn(v-model="element.visible")
                      v-icon(
                        v-if="!(element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1)",
                        @click="delRect(index)"
                      ) mdi-minus-circle-outline
                      v-icon(
                        v-if="element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1"
                      ) mdi-checkbox-blank-circle-outline
                  v-text-field(
                    v-model.trim="element.name",
                    :readonly="element.id !== id || !element.edit",
                    :disabled="element.name === 'content' && template.filter(({ name }) => name === 'content').length === 1",
                    prefix="#",
                    variant="underlined",
                    :rules="[(v) => !!v || 'Field is required', (v) => !(template.filter(({ name }) => name === v).length - 1) || 'Must be unique']",
                    @blur="element.edit = false"
                  )
                  template(#append)
                    v-list-item-action
                      v-icon(@click="addRect(index)") mdi-plus-circle-outline
                      v-icon mdi-drag-vertical
    v-window-item(value="2")
      v-container.h-100(fluid)
        v-selection-control-group.align-center(
          v-for="(value, name, index) in m",
          :key="index",
          v-model="value.key",
          inline,
          mandatory
        )
          v-sheet(:width="30") {{ `${name}-` }}
          v-radio(label="none", :value="0")
          v-radio(label="auto", :value="1")
          v-radio.flex-fill(:value="2")
            template(#label)
              v-text-field(
                v-model="value.value",
                min="-16",
                max="16",
                step="1",
                type="number",
                @input="(event) => { value.value = event.target.value !== '' ? event.target.value : 0; }"
              )
    v-window-item(value="3")
      v-container.h-100(fluid)
        v-switch(
          v-model="item.fluid",
          :label="`Type: ${item.fluid ? 'fluid' : 'responsive'}`",
          inset,
          hide-details
        )
        v-combobox(
          v-model="item.classes",
          label="classes",
          chips,
          closable-chips,
          multiple,
          persistent-hint,
          hint="case-sensitive classes of the layer",
          :delimiters="[',', ' ']",
          :open-on-clear="false"
        )
.rounded.border.d-flex.flex-column.overflow-hidden.h-100
  v-tabs(v-model="tab", show-arrows, grow)
    v-tab(value="1", prepend-icon="mdi-eye") Visual
    v-tab(value="2", prepend-icon="mdi-code-tags") Source
  v-window.h-100(v-model="tab")
    v-window-item.h-100(value="1")
      v-overlay(
        v-if="item && item.name === 'content'",
        :model-value="true",
        z-index="2",
        contained,
        persistent,
        no-click-animation,
        content-class="w-100 h-100"
      )
      v-wysiwyg(v-if="item", v-model="item.value")
    v-window-item.h-100(value="2")
      v-overlay(
        v-if="item && item.name === 'content'",
        :model-value="true",
        z-index="2",
        contained,
        persistent,
        no-click-animation,
        content-class="w-100 h-100"
      )
      v-source-code(v-if="item", v-model="item.value")
</template>
<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useDisplay } from "vuetify";
import { get, set, watchTriggerable, useArrayFind } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import kosmos3 from "@/kosmos3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";

const store = kosmos3();
const { panel, template } = storeToRefs(store);
const { calcLayer } = store;
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref(1);
const drawer = ref(1);
const form = ref();
const item = useArrayFind(template, ({ id }) => id === get(id));
const id = ref();
/** */
const getMKey = (prefix) => {
  const regexp = new RegExp(`^${prefix}-`);
  const { classes } = get(item) || {};
  const result = classes.find((element) => regexp.test(element));
  return result === `${prefix}-auto` ? 1 : 2 * !!result;
};
/** */
const setM = (prefix, value, m) => {
  const regexp = new RegExp(`^${prefix}-`);
  get(item).classes = get(item).classes.filter(
    (element) => !regexp.test(element)
  );
  if (value) {
    get(item).classes.push(
      value - 1
        ? `${prefix}-${(m[prefix].value || 0).toString().replace(/^-/, "n")}`
        : `${prefix}-auto`
    );
  }
};
const m = reactive({
  mt: {
    key: computed({
      /** @returns {number} позиция радиокнопки */
      get() {
        return getMKey("mt");
      },
      /** @param value */
      set(value) {
        setM("mt", value, m);
      },
    }),
    value: computed({
      /** @returns {number} позиция радиокнопки */
      get() {
        const prefix = "mt";
        const regexp = new RegExp(`^${prefix}-`);
        const { classes } = get(item) || {};
        return (
          Number(
            (classes.find((element) => regexp.test(element)) || "").replace(
              regexp,
              ""
            )
          ) || 0
        );
      },
      /** @param value */
      set(value) {
        console.log(value);
        // setM("mt", value, m);
      },
    }),
  },
  mb: {
    key: ref(0),
    value: ref(0),
  },
  ml: {
    key: ref(0),
    value: ref(0),
  },
  mr: {
    key: ref(0),
    value: ref(0),
  },
  ms: {
    key: ref(0),
    value: ref(0),
  },
  me: {
    key: ref(0),
    value: ref(0),
  },
  mx: {
    key: ref(0),
    value: ref(0),
  },
  my: {
    key: ref(0),
    value: ref(0),
  },
  ma: {
    key: ref(0),
    value: ref(0),
  },
});
const { trigger: triggerTemplate } = watchTriggerable(
  template,
  (value, oldValue) => {
    console.log(value);
    if (value.length && !(oldValue || []).length) {
      set(id, value[0].id);
      set(template, value);
    } else get(form).validate();
  },
  { deep: true }
);
onMounted(() => {
  setTimeout(() => {
    triggerTemplate();
  });
});
/** @param {number} index индекс */
const addRect = (index) => {
  get(template).splice(index + 1, 0, calcLayer());
};
/** @param {number} index индекс */
const delRect = (index) => {
  const last = get(template).length - 1;
  if (last) {
    get(template).splice(index, 1);
    set(id, get(template)[index === last ? index - 1 : index].id);
  }
};
/** @param {number} index индекс */
const clickRect = (index) => {
  const element = get(template)[index];
  if (get(id) !== element.id) set(id, element.id);
  else element.edit = true;
};
</script>
