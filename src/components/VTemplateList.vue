<template lang="pug">
v-sheet
  v-form(ref="form")
    v-list
      draggable(v-model="template", item-key="id")
        template(#item="{ element, index }")
          v-list-item.px-1.py-0(
            :value="element.id",
            :active="element.id === id",
            @click="clickLayer(index)",
            @blur="element.edit = false"
          )
            template(#prepend)
              v-list-item-action
                v-checkbox-btn(v-if="element", v-model="element.visible")
                v-icon(
                  v-if="element.name !== 'content' || cntLayerNames('content') > 1",
                  @click="delLayer(index)"
                ) mdi-minus-circle-outline
                v-icon(
                  v-if="!(element.name !== 'content' || cntLayerNames('content') > 1)"
                ) mdi-checkbox-blank-circle-outline
            v-text-field(
              v-if="element",
              v-model.trim="element.name",
              :readonly="element.id !== id || !element.edit",
              :disabled="!(element.name !== 'content' || cntLayerNames('content') > 1)",
              cur-prefix="#",
              variant="underlined",
              :rules="[ruleRequired, ruleUnique]",
              @blur="element.edit = false"
            )
            template(#append)
              v-list-item-action
                v-icon(@click="addLayer(index)") mdi-plus-circle-outline
                v-icon mdi-drag-vertical
  v-expansion-panels(v-model="panel")
    v-expansion-panel(title="classes")
      v-expansion-panel-text
        v-combobox(
          v-if="item",
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
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import app from "@/store/app";
import template3 from "@/store/template";

/**
 * @typedef {object} kosmos3
 * @property {Function} calcLayer - вычисление начальной структуры слоя шаблона
 */

/**
 * @typedef {object} refsKosmos3
 * @property {object} template - объект со всей информацией о шаблоне
 * @property {object} template.value - значение объекта со всей информацией о шаблоне
 */

/**
 * @typedef {object} refsTemplate3
 * @property {object} id - идентификатор выбранного слоя
 * @property {string} id.value - значение идентификатора выбранного слоя
 * @property {object} item - объект с информацией по выбранному слою
 * @property {object} item.value - значение объекта с информацией по выбранному слою
 */

/**
 * @typedef {object} layer
 * @property {string} id - идентификатор слоя
 */

/**
 * глобальное хранилище для приложения
 * @constant store
 * @type {app}
 */
const store = app();
/**
 * референсы глобального хранилища для приложений
 * @constant storeRefs
 * @type {refsKosmos3}
 */
const storeRefs = storeToRefs(store);
const { template } = storeRefs;
const { calcLayer } = store;
/**
 * хранилище для раздела типа шаблон
 * @constant localStore
 * @type {object}
 */
const localStore = template3();
/**
 * референсы хранилища раздела шаблон
 * @constant slocalStoreResfs
 * @type {refsTemplate3}
 */
const slocalStoreResfs = storeToRefs(localStore);
const { id, item } = slocalStoreResfs;
/**
 * проверка наличия названия слоя
 * @function ruleRequired
 * @param {string} pValue - название слоя
 * @returns {boolean|string} - истина при наличии названия слоя, ошибка при отсутствии
 */
const ruleRequired = (pValue) => {
  /**
   * инвертированное значение названия слоя
   * @constant lInvertedValue
   * @type {boolean}
   */
  const lInvertedValue = !pValue;
  /**
   * флаг ниличия названия слоя
   * @constant lValue
   * @type {boolean}
   */
  const lValue = !lInvertedValue;
  /**
   * результат проверки наличия названия слоя содержит истину или ошибку
   * @constant lResult
   * @type {boolean|string}
   */
  const lResult = lValue || "Field is required";
  return lResult;
};
/**
 * подсчет количества вхождений слоя с определенным названием в список слоев шаблона
 * @function cntLayerNames
 * @param {string} pCheckedName - название слоя для проверки
 * @returns {number} количество слоев с опреденным именем в списке слоев шаблона
 */
const cntLayerNames = (pCheckedName) => {
  /**
   * объект со всей информацией о шаблоне
   * @constant lTemplate
   * @type {object}
   */
  const lTemplate = get(template);
  /**
   * фильтр слоев шаблона по имени
   * @function lNameFilter
   * @param {object} layer - слой шаблона
   * @param {string} layer.name - название слоя шаблона
   * @returns {boolean} истина при совпадении названий иначе ложь
   */
  const lNameFilter = ({ name: pName }) => {
    /**
     * флаг совпадения названий слоев
     * @constant lIsEqualNames
     * @type {boolean}
     */
    const lIsEqualNames = pName === pCheckedName;
    return lIsEqualNames;
  };
  /**
   * массив слоев с заданным именем
   * @constant lFilteredNames
   * @type {Array}
   */
  const lFilteredNames = lTemplate.filter(lNameFilter);
  /**
   * количество слоев с заданным именем
   * @constant lFilteredNamesLength
   * @type {number}
   */
  const lFilteredNamesLength = lFilteredNames.length;
  return lFilteredNamesLength;
};
/**
 * проверка уникальности названия слоя
 * @function ruleUnique
 * @param {string} pName - название слоя
 * @returns {boolean|string} истина при уникальности названия слоя, ошибка при повторении
 */
const ruleUnique = (pName) => {
  /**
   * количество слоев с переданным именем
   * @constant lLayersCount
   * @type {number}
   */
  const lLayersCount = cntLayerNames(pName);
  /**
   * флаг уникальности слоя с переданным именем
   * @constant lIsLayersUnique
   * @type {boolean}
   */
  const lIsLayersUnique = lLayersCount === 1;
  /**
   * результат рассчета уникальности слоя содержит истину или ошибку
   * @constant lResult
   * @type {boolean|string}
   */
  const lResult = lIsLayersUnique || "Must be unique";
  return lResult;
};
/**
 * объект экранной формы
 * @constant form
 * @type {object}
 * @property {object} value - значение
 */
const form = ref();
/**
 * состояние панели аккордеона - открыта/закрыта
 * @constant panel
 * @type {object}
 * @property {Array} value - значение
 */
const panel = ref([0]);
/**
 * запуск валидации экранной формы
 * @function formValidate
 */
const formValidate = () => {
  /**
   * объект экранной формы
   * @constant lForm
   * @type {object}
   */
  const lForm = get(form);
  lForm.validate();
};
/**
 * объект с параметров для наблюдателя
 * @constant optionsDeep
 * @type {object}
 * @property {boolean} deep - глубокое отслеживание
 */
const optionsDeep = { deep: true };
/**
 * запуск валидации формы после перерисовки
 * @function nextTickFormValidate
 * @async
 */
const nextTickFormValidate = async () => {
  await nextTick();
  formValidate();
};
/**
 * добавление слоя шаблона
 * @function addLayer
 * @param {number} pIndex - порядковый номер выбранного слоя шаблона
 */
const addLayer = (pIndex) => {
  /**
   * объект со всей информацией о шаблоне
   * @constant lTemplate
   * @type {object}
   */
  const lTemplate = get(template);
  /**
   * начальная структура слоя шаблона
   * @constant lLayer
   * @type {object}
   */
  const lLayer = calcLayer();
  /**
   * порядковый номер нового слоя
   * @constant lIndex
   * @type {number}
   */
  const lIndex = pIndex + 1;
  lTemplate.splice(lIndex, 0, lLayer);
};
/**
 * удаление слоя шаблона
 * @function delLayer
 * @param {number} pIndex - порядковый номер удаляемого слоя
 */
const delLayer = (pIndex) => {
  /**
   * объект со всей информацией о шаблоне
   * @constant lTemplate
   * @type {object}
   */
  const lTemplate = get(template);
  /**
   * порядковый номер предыдущего слоя от выбранного
   * @constant lIndex
   * @type {number}
   */
  const lIndex = pIndex - 1;
  /**
   * количество слоев
   * @constant lTemplateLength
   * @type {number}
   */
  const lTemplateLength = lTemplate.length;
  /**
   * порядковый номер последнего слоя
   * @constant lLast
   * @type {number}
   */
  const lLast = lTemplateLength - 1;
  if (lLast) {
    lTemplate.splice(pIndex, 1);
    /**
     * порядковый номер для выбора слоя после удаления
     * @constant lNewIndex
     * @type {number}
     */
    const lNewIndex = pIndex === lLast ? lIndex : pIndex;
    /**
     * объект с информацией о выбираемом слое после удаления
     * @constant element
     * @type {layer}
     */
    const element = get(template, lNewIndex);
    const {
      /**
       * идентификатор выбираемого слоя после удаления
       * @constant lId
       * @type {string}
       */
      id: lId,
    } = element;
    set(id, lId);
  }
};
/**
 * выбор слоя
 * @function clickLayer
 * @param {number} pIndex - порядковый номер выбираемого слоя
 */
const clickLayer = (pIndex) => {
  /**
   * объект с информацией о выбираемом слое
   * @constant element
   * @type {layer}
   */
  const element = get(template, pIndex);
  const {
    /**
     * идентификатор выбираемого слоя
     * @constant lId
     * @type {string}
     */
    id: lId,
  } = element;
  /**
   * идентификатор предыдущего выбранного слоя
   * @constant lCurId
   * @type {string}
   */
  const lCurId = get(id);
  if (lCurId !== lId) set(id, lId);
  else element.edit = true;
};
watch(template, formValidate, optionsDeep);
onMounted(nextTickFormValidate);
</script>
