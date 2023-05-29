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
          import("@/views/HomeView.vue"),
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
          import("@/views/AboutView.vue"),
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
        path: "",
        name: "Content",
        /**
         * @returns {object} - модуль страницы контент
         */
        component: () =>
          import("@/views/ContentView.vue"),
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
          import("@/views/TemplateView.vue"),
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
          import("@/views/CssView.vue"),
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
          import("@/views/JsView.vue"),
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
          import("@/views/SettingsView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
