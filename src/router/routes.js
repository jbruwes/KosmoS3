const routes = [
  {
    path: "/",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        /**
         * @returns {object} - модуль домашней страницы
         */
        component: () => import("@/pages/HomePage.vue"),
      },
    ],
  },
  {
    path: "/about",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "About",
        /**
         * @returns {object} - модуль страницы о программе
         */
        component: () => import("@/pages/AboutPage.vue"),
      },
    ],
  },
  {
    path: "/content",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Content",
        /**
         * @returns {object} - модуль страницы контент
         */
        component: () => import("@/pages/ContentPage.vue"),
      },
    ],
  },
  {
    path: "/css",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Css",
        /**
         * @returns {object} - модуль страницы каскадных стилей
         */
        component: () => import("@/pages/CssPage.vue"),
      },
    ],
  },
  {
    path: "/js",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Js",
        /**
         * @returns {object} - модуль страницы джава скипта
         */
        component: () => import("@/pages/JsPage.vue"),
      },
    ],
  },
  {
    path: "/settings",
    /**
     * @returns {object} - модуль шаблона по умолчанию
     */
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Settings",
        /**
         * @returns {object} - модуль страницы настроек
         */
        component: () => import("@/pages/SettingsPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    /**
     * @returns {object} - страница ошибки
     */
    component: () => import("@/pages/ErrorNotFound.vue"),
  },
];

export default routes;
