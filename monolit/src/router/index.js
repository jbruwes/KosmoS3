import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
  /**
   * @param {object} to - Route object
   * @param {object} from - Route object
   * @param {object} savedPosition - Сохраненный сдвиг
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition)
      document.getElementById(to.name)?.scrollIntoView({
        behavior: "instant",
      });
  },
});

export default router;
