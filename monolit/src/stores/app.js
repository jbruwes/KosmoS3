import * as tresjsCientos from "@tresjs/cientos";
import * as tresjsCore from "@tresjs/core";
import * as vueuseComponents from "@vueuse/components";
import * as vueuseCore from "@vueuse/core";
import * as vueuseMath from "@vueuse/math";
import { defineStore } from "pinia";
import * as vue from "vue";
import * as vueRouter from "vue-router";
import { loadModule } from "vue3-sfc-loader";

const { defineAsyncComponent } = vue;
const { useStyleTag } = vueuseCore;

/** Модули, передаваемые шаблону */
const moduleCache = {
  vue,
  "vue-router": vueRouter,
  "@vueuse/core": vueuseCore,
  "@vueuse/math": vueuseMath,
  "@vueuse/components": vueuseComponents,
  "@tresjs/core": tresjsCore,
  "@tresjs/cientos": tresjsCientos,
};

/**
 * Процедура логирования ошибок
 *
 * @param {string} type - Тип записи
 * @param {...any} args - Содержимое записи
 */
const log = (type, ...args) => {
  // eslint-disable-next-line no-console
  console[type](...args);
};

/**
 * Задержка рендеригна шаблона
 *
 * @type {number}
 */
const delay = 0;

/**
 * Функция, возвращающая Promise на сконструированный шаблон
 *
 * @param {object} the - Текущий объект
 * @returns {object} Шаблон
 */
const fncTemplate = (the) => {
  /** Константа со скриптами */
  const cntScript = `<script setup>const props=defineProps(["the","mdi"]);${the.script ?? ""}</script>`;

  /** Константа с шаблоном */
  const cntTemplate = `<template>${the.template ?? ""}</template>`;

  /** Константа со стилями */
  const cntStyle = `<style scoped>${the.style ?? ""}</style>`;

  /**
   * Функция получения файла шаблона
   *
   * @returns {string} Шаблон
   */
  const getFile = () => `${cntScript}${cntTemplate}${cntStyle}`;

  /**
   * Процедура добавления стилей
   *
   * @param {string} style - Стили
   */
  const addStyle = (style) => {
    /**
     * Id стиля
     *
     * @type {string}
     */
    const id = `style_${the.id}`;

    useStyleTag(style, { id });
  };

  /**
   * Загрузчик шаблона
   *
   * @returns {Promise} Промис
   */
  const loader = () =>
    loadModule(`/${the.id}.vue`, { moduleCache, getFile, addStyle, log });

  return defineAsyncComponent({ loader, delay });
};

/**
 * Функция, возвращающая объект хранилища
 *
 * @returns {object} Объект хранилища
 */
const fncStoreSetup = () => ({ fncTemplate });

/** Хранилище приложения монолит */
export default defineStore("app", fncStoreSetup);
