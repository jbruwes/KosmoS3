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
        | margin
        .d-flex
          div(v-for="(value, name, index) in m", :key="index")
            v-radio-group(
              v-model="value.type",
              density="compact",
              hide-details
            )
              v-radio.align-end(
                density="compact",
                :true-icon="value.icon",
                :value="2"
              )
                template(#label)
                  v-text-field(
                    v-model="value.size",
                    min="-16",
                    max="16",
                    step="1",
                    type="number",
                    density="compact",
                    hide-details,
                    @input="(event) => { value.size = event.target.value !== '' ? event.target.value : 0; }"
                  )
              v-radio(
                label="auto",
                density="compact",
                :true-icon="value.icon",
                :value="1"
              )
              v-radio(
                label="none",
                density="compact",
                :true-icon="value.icon",
                :value="0"
              )
        v-divider.mt-2
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
import { ref, onMounted, reactive, computed, nextTick } from "vue";
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
const id = ref();
const item = useArrayFind(template, ({ id: lId }) => lId === get(id));
/** */
const margins = computed(() => {
  /**
   * @param {string} value направление
   * @returns {string} класс
   */
  const margin = (value) =>
    (
      get(item).classes.find((element) =>
        new RegExp(`${value}(auto|\\bn?([0-9]|1[0-6])\\b)$`).test(element)
      ) || ""
    ).replace(new RegExp(value), "");
  const result = { mt: "", mb: "", ml: "", mr: "" };
  const ma = margin("^ma-");
  if (ma) {
    result.mt = ma;
    result.mb = ma;
    result.ml = ma;
    result.mr = ma;
  }
  const mx = margin("^mx-");
  if (mx) {
    result.ml = mx;
    result.mr = mx;
  }
  const my = margin("^my-");
  if (my) {
    result.mt = my;
    result.mb = my;
  }
  result.mt = margin("^mt-") || result.mt;
  result.mb = margin("^mb-") || result.mb;
  result.ml = margin("^ml-") || result.ml;
  result.mr = margin("^mr-") || result.mr;
  return result;
});
/**
 *
 * @param {string} prefix префикс класса
 * @returns {number} тип
 */
const getMType = (prefix) =>
  get(margins, prefix) === "auto" ? 1 : 2 * !!get(margins, prefix);
/** @param {object} value новые значения марждин */
const setM = (value) => {
  get(item).classes = get(item).classes.filter(
    (element) =>
      !/^(ma|mx|my|mt|mb|ml|mr)-(auto|\bn?([0-9]|1[0-6])\b)$/.test(element)
  );
  Object.keys(value).forEach((element) => {
    const margin = value[element];
    if (margin) get(item).classes.push(`${element}-${margin}`);
  });
};
const m = reactive({
  mt: {
    type: computed({
      /** @returns {number} позиция радиокнопки */
      get() {
        return getMType("mt");
      },
      /** @param {number} value позиция радиокнопки */
      set(value) {
        setM({
          ...get(margins),
          mt: {
            0: "",
            1: "auto",
            2: m.mt.size.toString().replace(/^-/, "n"),
          }[value],
        });
      },
    }),
    size: ref(0),
    icon: "mdi-arrow-up-circle-outline",
  },
  mb: {
    type: ref(0),
    size: ref(0),
    icon: "mdi-arrow-down-circle-outline",
  },
  ml: {
    type: ref(0),
    size: ref(0),
    icon: "mdi-arrow-left-circle-outline",
  },
  mr: {
    type: ref(0),
    size: ref(0),
    icon: "mdi-arrow-right-circle-outline",
  },
});
const { trigger: triggerTemplate } = watchTriggerable(
  template,
  (value, oldValue) => {
    if (value.length && !(oldValue || []).length) {
      set(id, value[0].id);
      set(template, value);
    } else get(form).validate();
  },
  { deep: true }
);
onMounted(async () => {
  await nextTick();
  triggerTemplate();
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
    set(id, get(template, index === last ? index - 1 : index).id);
  }
};
/** @param {number} index индекс */
const clickRect = (index) => {
  const element = get(template)[index];
  if (get(id) !== element.id) set(id, element.id);
  else element.edit = true;
};
</script>
