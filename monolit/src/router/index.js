import { createRouter, createWebHistory } from "vue-router";

/**
 * Объект истории
 *
 * @type {object}
 */
const history = createWebHistory(import.meta.env.BASE_URL);

/**
 * Роуты
 *
 * @type {Array}
 */
const routes = [];

export default createRouter({ history, routes });
