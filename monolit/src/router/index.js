import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
  /**
   * @param {object} to - Объект перехода
   * @returns {object} - Объект с параметрами прокрутки
   */
  scrollBehavior(to) {
    const { name } = to;
    const el = `#${name}`;
    const behavior = "smooth";
    return { el, behavior };
  },
});

export default router;
