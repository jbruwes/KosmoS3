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
      v-container.pa-0(fluid)
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
                    cur-prefix="#",
                    variant="underlined",
                    :rules="[(v) => !!v || 'Field is required', (v) => !(template.filter(({ name }) => name === v).length - 1) || 'Must be unique']",
                    @blur="element.edit = false"
                  )
                  template(#append)
                    v-list-item-action
                      v-icon(@click="addRect(index)") mdi-plus-circle-outline
                      v-icon mdi-drag-vertical
    v-window-item(value="2")
      v-responsive-classes
      v-container(fluid)
        | margin
        .d-flex
          div(v-for="(value, name, index) in margins", :key="index")
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
        v-divider.my-4
        | padding
        .d-flex
          div(v-for="(value, name, index) in paddings", :key="index")
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
                    min="0",
                    max="16",
                    step="1",
                    type="number",
                    density="compact",
                    hide-details,
                    @input="(event) => { value.size = event.target.value !== '' ? event.target.value : 0; }"
                  )
              v-radio(
                label="none",
                density="compact",
                :true-icon="value.icon",
                :value="0"
              )
        v-divider.my-4
    v-window-item(value="3")
      v-container(fluid)
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
import { ref, onMounted, computed, nextTick } from "vue";
import { useDisplay } from "vuetify";
import { get, set, watchTriggerable, useArrayFind } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import kosmos3 from "@/kosmos3";
import VWysiwyg from "@/components/VWysiwyg.vue";
import VSourceCode from "@/components/VSourceCode.vue";
import VResponsiveClasses from "@/components/VResponsiveClasses.vue";

const store = kosmos3();
const { panel, template } = storeToRefs(store);
const { calcLayer, fromClasses, toClasses } = store;
const { mobile } = useDisplay();
set(panel, !get(mobile));
const tab = ref(1);
const drawer = ref(1);
const form = ref();
const id = ref();
const item = useArrayFind(template, ({ id: lId }) => lId === get(id));
/**
 *
 * @param {string} k ключ
 * @param {object} v значение
 * @param {object} map карта префиксов
 * @param {string} mask маска
 * @returns {object} рассчетный объект
 */
const cmpSizeType = (k, v, map, mask) => ({
  ...v,
  /** @returns {string} размер */
  get size() {
    const { size } = fromClasses(map, mask, item)[k] || {};
    return size;
  },
  /** @param {number} value размер */
  set size(value) {
    const result = fromClasses(map, mask, item);
    result[k].value = {
      0: "",
      1: "auto",
      2: value.toString().replace(/^-/, "n"),
    }[this.type];
    toClasses(result, map, mask, item);
  },
  /** @returns {number} тип */
  get type() {
    const { type } = fromClasses(map, mask, item)[k] || {};
    return type;
  },
  /** @param {number} value тип */
  set type(value) {
    const result = fromClasses(map, mask, item);
    result[k].value = {
      0: "",
      1: "auto",
      2: this.size.toString().replace(/^-/, "n"),
    }[value];
    toClasses(result, map, mask, item);
  },
});
const margins = computed(() =>
  Object.fromEntries(
    Object.entries({
      mt: {
        icon: "mdi-arrow-up-circle-outline",
      },
      mb: {
        icon: "mdi-arrow-down-circle-outline",
      },
      ml: {
        icon: "mdi-arrow-left-circle-outline",
      },
      mr: {
        icon: "mdi-arrow-right-circle-outline",
      },
    }).map(([k, v]) => [
      k,
      cmpSizeType(
        k,
        v,
        {
          ma: ["mt", "mb", "ml", "mr"],
          mx: ["ml", "mr"],
          my: ["mt", "mb"],
          mt: ["mt"],
          mb: ["mb"],
          ml: ["ml"],
          mr: ["mr"],
        },
        "(auto|\\bn?([0-9]|1[0-6])\\b)"
      ),
    ])
  )
);
const paddings = computed(() =>
  Object.fromEntries(
    Object.entries({
      pt: {
        icon: "mdi-arrow-up-circle-outline",
      },
      pb: {
        icon: "mdi-arrow-down-circle-outline",
      },
      pl: {
        icon: "mdi-arrow-left-circle-outline",
      },
      pr: {
        icon: "mdi-arrow-right-circle-outline",
      },
    }).map(([k, v]) => [
      k,
      cmpSizeType(
        k,
        v,
        {
          pa: ["pt", "pb", "pl", "pr"],
          px: ["pl", "pr"],
          py: ["pt", "pb"],
          pt: ["pt"],
          pb: ["pb"],
          pl: ["pl"],
          pr: ["pr"],
        },
        "\\b([0-9]|1[0-6])\\b"
      ),
    ])
  )
);
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
