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
    ],
  },

  {
    path: "/about",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "About",
        /**
         * @returns {object} - модуль страницы о программе
         */
        component: () =>
          import(/* webpackChunkName: "about" */ "@/views/AboutView.vue"),
      },
    ],
  },

  {
    path: "/content",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "Content",
        name: "",
        /**
         * @returns {object} - модуль страницы контент
         */
        component: () =>
          import(/* webpackChunkName: "content" */ "@/views/ContentView.vue"),
      },
    ],
  },
  {
    path: "/template",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "Template",
        /**
         * @returns {object} - модуль страницы шаблон
         */
        component: () =>
          import(/* webpackChunkName: "template" */ "@/views/TemplateView.vue"),
      },
    ],
  },
  {
    path: "/css",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "Css",
        /**
         * @returns {object} - модуль страницы каскадных стилей
         */
        component: () =>
          import(/* webpackChunkName: "css" */ "@/views/CssView.vue"),
      },
    ],
  },
  {
    path: "/js",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "Js",
        /**
         * @returns {object} - модуль страницы джава скипта
         */
        component: () =>
          import(/* webpackChunkName: "js" */ "@/views/JsView.vue"),
      },
    ],
  },

  {
    path: "/settings",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "Settings",
        /**
         * @returns {object} - модуль страницы настроек
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
