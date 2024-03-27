require("@rushstack/eslint-patch/modern-module-resolution");

/**
 * Библиотека "node:path"
 *
 * @type {object}
 */
const path = require("node:path");

/**
 * Функция "@vue/eslint-config-airbnb/createAliasSetting"
 *
 * @type {Function}
 */
const createAliasSetting = require("@vue/eslint-config-airbnb/createAliasSetting");

/**
 * Расширенные настройки с синонимом "@"
 *
 * @type {object}
 */
const settings = {
  ...createAliasSetting({
    "@": `${path.resolve(__dirname, "./src")}`,
  }),
};

module.exports = { settings };
