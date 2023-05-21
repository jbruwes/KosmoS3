// Composables
import { createRouter, createMemoryHistory } from "vue-router";

const routes = [
  {
    path: "/",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
      },
      {
        path: "/about",
        name: "About",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () =>
          import(/* webpackChunkName: "about" */ "@/views/AboutView.vue"),
      },
      {
        path: "Content",
        name: "/content",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () =>
          import(/* webpackChunkName: "content" */ "@/views/ContentView.vue"),
      },
      {
        path: "/template",
        name: "Template",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () =>
          import(/* webpackChunkName: "template" */ "@/views/TemplateView.vue"),
      },
      {
        path: "/css",
        name: "Css",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () =>
          import(/* webpackChunkName: "css" */ "@/views/CssView.vue"),
      },
      {
        path: "/js",
        name: "Js",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () =>
          import(/* webpackChunkName: "js" */ "@/views/JsView.vue"),
      },
      {
        path: "/settings",
        name: "Settings",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () =>
          import(/* webpackChunkName: "settings" */ "@/views/SettingsView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
