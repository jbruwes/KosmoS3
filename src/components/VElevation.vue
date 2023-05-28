<template lang="pug">
v-sheet.d-flex.py-4
  v-checkbox-btn.pr-2(v-model="enabled")
  v-text-field(
    v-model.number="elevation",
    :disabled="!enabled",
    label="elevation",
    min="0",
    max="24",
    step="1",
    type="number",
    density="compact",
    hide-details
  )
</template>

<script setup>
import { computed } from "vue";
import template3 from "@/store/template3";

/**
 * @constant {Array} array25 массив из 25-ти пустых элементов
 */
const array25 = Array(25);
/**
 * @constant {Object<number>} итератор для пустого массива из 25-ти элементов
 */
const array25Iterator = array25.keys();
/**
 * @constant {Array} keys25 массив, заполненный числами от 0 до 24
 */
const keys25 = Array.from(array25Iterator);
/**
 * @constant {string} строка чисел от 0 до 24 с вертикальной чертой в качестве разделителя
 */
const maskString = keys25.join("|");
/**
 * @constant {string} mask маска из значений от 0 до 24
 */
const mask = `(${maskString})`;
/**
 * @constant {object} localStore хранилище для раздела типа шаблон
 */
const localStore = template3();
const {
  /**
   * @constant {Function} fromClassesOnce поиск одного заданного класса в списке назначенных классов
   */
  fromClassesOnce,
  /**
   * @constant {Function} toClassesOnce назначение одного класса в список назначенных классов
   */
  toClassesOnce,
  /**
   * @constant {Function} deleteClasses удаление класса по маске из списка назначенных классов
   */
  deleteClasses,
} = localStore;
/**
 * @constant {Function} getEnabled рассчет значения выключателя поля elevation
 * @returns {boolean} значение выключателя поля elevation
 */
const getEnabled = () => !!fromClassesOnce("elevation", mask, false);
/**
 * @constant {Function} setEnabled установка класса elevation в списке назначенных классов
 * @param {boolean} pValue значение выключателя поля elevation
 */
const setEnabled = (pValue) => {
  deleteClasses("elevation", mask, false);
  if (pValue) toClassesOnce("elevation", "0", false);
};
/**
 * @constant {object} optionsEnabled константа для вычисления значения выключателя поля elevation
 */
const optionsEnabled = { get: getEnabled, set: setEnabled };
/**
 * @constant {object} enabled computed
 * @property {boolean} value выключатель поля elevation
 */
const enabled = computed(optionsEnabled);
/**
 * @constant {Function} getElevation рассчет значения поля elevation
 * @returns {string} значение поля elevation
 */
const getElevation = () => fromClassesOnce("elevation", mask, false);
/**
 * @constant {Function} setElevation установка класса elevation в списке назначенных классов
 * @param {number} pValue значение поля elevation
 */
const setElevation = (pValue) => {
  if (typeof pValue === "number" && pValue >= 0 && pValue <= 24) {
    deleteClasses("elevation", mask, false);
    toClassesOnce("elevation", pValue, false);
  }
};
/**
 * @constant {object} optionsElevation константа для вычисления значения поля elevation
 */
const optionsElevation = { get: getElevation, set: setElevation };
/**
 * @constant {object} enabled computed
 * @property {boolean} value значение поля elevation
 */
const elevation = computed(optionsElevation);
</script>
