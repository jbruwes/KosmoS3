const routes = [
  {
    path: "/",
    /**
     * @returns {object} - основной лейаут
     */
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        /**
         * @returns {object} - главная страница
         */
        component: () => import("@/pages/IndexPage.vue"),
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
