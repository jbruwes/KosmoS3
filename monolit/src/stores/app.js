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
 * @type {Function}
 * @param {string} type - Тип записи
 * @param {...any} args - Содержимое записи
 */
const log = (type = "log", ...args) => {
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
 * @type {Function}
 * @param {object} page - Объект страницы
 * @param {string} page.id - Id страницы
 * @param {string} page.template - Шаблон страницы
 * @param {string} page.script - Скрипты страницы
 * @param {string} page.style - Стили страницы
 * @param {string} page.path - Путь до страницы
 * @param {boolean} page.setup - Тип скриптов
 * @param {boolean} page.scoped - Тип стилей
 * @returns {object} Шаблон
 */
const fncTemplate = ({
  id = crypto.randomUUID(),
  template = "",
  script = "",
  style = "",
  path = "",
  setup = true,
  scoped = true,
} = {}) => {
  /** Константа со скриптами */
  const cntScript = script
    ? `<script${setup ? " setup" : ""}>${script}</script>`
    : script;

  /** Константа с шаблоном */
  const cntTemplate = template ? `<template>${template}</template>` : template;

  /** Константа со стилями */
  const cntStyle = style
    ? `<style${scoped ? " scoped" : ""}>${style}</style>`
    : style;

  /**
   * Функция получения файла шаблона
   *
   * @type {Function}
   * @returns {string} Шаблон
   */
  const getFile = () => `${cntScript}${cntTemplate}${cntStyle}`;

  /**
   * Процедура добавления стилей
   *
   * @type {Function}
   * @param {string} styles - Стили
   */
  const addStyle = (styles = "") => {
    useStyleTag(styles, { id: `style_${id}` });
  };

  /**
   * Загрузчик шаблона
   *
   * @type {Function}
   * @returns {Promise} Промис
   */
  const loader = () =>
    loadModule(`${["", "/"].includes(path) ? "" : "/"}${path}/view.vue`, {
      moduleCache,
      getFile,
      addStyle,
      log,
    });

  return defineAsyncComponent({ loader, delay });
};

/**
 * Функция, возвращающая объект хранилища
 *
 * @type {Function}
 * @returns {object} Объект хранилища
 */
const fncStoreSetup = () => ({ fncTemplate });

/** Хранилище приложения монолит */
export default defineStore("app", fncStoreSetup);
