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
      v-container.h-100(fluid)
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
import { ref, onMounted, computed, nextTick } from "vue";
import { useDisplay } from "vuetify";
import {
  get,
  set,
  watchTriggerable,
  useArrayFind,
  isDefined,
} from "@vueuse/core";
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
/**
 * @param {object} pattern новые значения
 * @param {object} map карта префиксов
 * @param {string} mask маска
 */
const toClasses = (pattern, map, mask) => {
  const dynaMap = structuredClone(map);
  const prefixes = Object.keys(map);
  let buffer = [];
  /**
   *
   * @param {Array} vector текущий проверочный вектор
   * @param {string} vector."0" кандидат для проверки
   * @param {string} curPrefix текущий префикс
   */
  const mutateMap = ([candidate], curPrefix) => {
    /**
     *
     * @param {object} candidate объект кандидата
     * @param {string} candidate.value значение кандидата
     */
    const mutateCandidate = ({ value }) => {
      /**
       *
       * @param {string} pValue1 значение кандидата
       * @param {object} checker объект для сравнения
       * @param {string} checker.value значение для сравнения
       * @returns {boolean} равенство
       */
      const compareValues = (pValue1, { value: pValue2 }) =>
        pValue1 === pValue2;
      if (
        value &&
        map[curPrefix].every((element) =>
          compareValues(value, pattern[element])
        )
      ) {
        dynaMap[curPrefix].forEach((checker) => {
          prefixes.forEach((prefix) => {
            if (curPrefix !== prefix) {
              const curCheckers = dynaMap[prefix];
              const i = curCheckers.indexOf(checker);
              if (i !== -1) {
                curCheckers.splice(i, 1);
                if (curCheckers.indexOf(curPrefix) === -1)
                  curCheckers.push(curPrefix);
              }
            }
          });
        });
        buffer = buffer.filter(
          ([prefix]) =>
            !dynaMap[curPrefix].find((checker) => prefix === checker)
        );
        buffer.push([curPrefix, value]);
      }
    };
    mutateCandidate(pattern[candidate]);
  };
  get(item).classes = get(item).classes.filter(
    (aclass) => !new RegExp(`^(${prefixes.join("|")})-${mask}$`).test(aclass)
  );
  prefixes.reverse().forEach((curPrefix) => {
    mutateMap(map[curPrefix], curPrefix);
  });
  buffer.forEach(([key, value]) => {
    get(item).classes.push(`${key}-${value}`);
  });
};
/**
 *
 * @param {object} map карта префиксов
 * @param {string} mask маска
 * @returns {object} объект значений
 */
const fromClasses = (map, mask) => {
  const keys = Object.keys(map);
  const result = {};
  keys.forEach((key) => {
    const value = (
      isDefined(item)
        ? get(item).classes.find((element) =>
            new RegExp(`^${key}-${mask}$`).test(element)
          ) || ""
        : ""
    ).replace(new RegExp(`^${key}-`), "");
    if (value)
      map[key].forEach((element) => {
        result[element] = { value };
      });
  });
  /**
   *
   * @param {object} element объект для рассчета
   * @param {string} element.value значение
   * @returns {object} рассчетный объект
   */
  const setSizeType = ({ value = "" }) => ({
    value,
    type: value === "auto" ? 1 : 2 * !!value,
    size: Number((value === "auto" ? "0" : value || "0").replace(/^n/, "-")),
  });
  /**
   *
   * @param {Array} keys ключи
   * @param {string} keys."0" первый ключ
   * @returns {object} общий результат
   */
  const calcResult = ([first]) =>
    Object.fromEntries(
      map[first].map((element) => [element, setSizeType(result[element] || {})])
    );
  return calcResult(keys);
};
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
    const { size } = fromClasses(map, mask)[k] || {};
    return size;
  },
  /** @param {number} value размер */
  set size(value) {
    const result = fromClasses(map, mask);
    result[k].value = {
      0: "",
      1: "auto",
      2: value.toString().replace(/^-/, "n"),
    }[this.type];
    toClasses(result, map, mask);
  },
  /** @returns {number} тип */
  get type() {
    const { type } = fromClasses(map, mask)[k] || {};
    return type;
  },
  /** @param {number} value тип */
  set type(value) {
    const result = fromClasses(map, mask);
    result[k].value = {
      0: "",
      1: "auto",
      2: this.size.toString().replace(/^-/, "n"),
    }[value];
    toClasses(result, map, mask);
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
