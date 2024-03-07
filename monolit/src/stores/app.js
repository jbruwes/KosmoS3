import * as tresjsCientos from "@tresjs/cientos";
import * as tresjsCore from "@tresjs/core";
import * as vueuseComponents from "@vueuse/components";
import * as vueuseCore from "@vueuse/core";
import * as vueuseMath from "@vueuse/math";
import { defineStore } from "pinia";
import * as vue from "vue";
import * as vueRouter from "vue-router";
import { loadModule } from "vue3-sfc-loader";

/** Функция подстановки стилей в секцию <head> */
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
 * Функция, возвращающая Promise на сконструированный шаблон
 *
 * @param {object} the - Текущий объект
 * @returns {object} Шаблон
 */
const getTemplate = (the) => {
  /** Константа со скриптами */
  const scriptSetup = `<script setup>const props=defineProps(["the","mdi"]);${the.script ?? ""}</script>`;

  /** Константа с шаблоном */
  const template = `<template>${the.template ?? ""}</template>`;
  /** Константа со стилями */
  const styleScoped = `<style scoped>${the.style ?? ""}</style>`;

  /**
   * Функция получения файла шаблона
   *
   * @returns {string} Шаблон
   */
  const getFile = () => `${scriptSetup}${template}${styleScoped}`;

  /**
   * Процедура добавления стилей
   *
   * @param {string} style - Стили
   */
  const addStyle = (style) => {
    useStyleTag(style, { id: `style_${the.id}` });
  };

  /** Виртуальный путь до модуля */
  const path = `/${the.id}.vue`;

  /** Параметры загрузки модуля */
  const options = { moduleCache, getFile, addStyle, log };

  return loadModule(path, options);
};

/** Id хранилища */
const id = "app";

/**
 * Функция, возвращающая объект хранилища
 *
 * @returns {object} Объект хранилища
 */
const storeSetup = () => ({ getTemplate });

/** Хранилище приложения монолит */
export default defineStore(id, storeSetup);
