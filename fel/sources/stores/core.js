import { defineStore } from "pinia";
import jsel from "jsel";

export default defineStore("core", {
  /**
   * @returns {object} Переменные состояния
   */
  state: () => ({
    tree: undefined,
    context: undefined,
  }),
  getters: {
    /**
     * Плоский индекс
     *
     * @returns {object[]} Плоский индекс для поиска
     */
    plainIndex() {
      const plainIndex = jsel(this.tree).selectAll("//*[@id]");
      plainIndex.forEach((node) => {
        const lNode = node;
        lNode.path = jsel(this.tree).selectAll(
          `//*[@id="${lNode.id}"]/ancestor-or-self::*[@id]`
        );
        lNode.path = lNode.path.map((e) =>
          e.value.trim().replace(/\s/g, "_").replace(/\//g, "")
        );
        lNode.path.shift();
        lNode.path = lNode.path.join("/");
        lNode.path = lNode.path ? `/${lNode.path}/` : "/";
        lNode.href = lNode.url
          ? lNode.url
              .trim()
              .replace(/\s/g, "_")
              .replace(/^\/+|\/+$/g, "")
          : "";
        lNode.href = lNode.href ? `/${lNode.href}/` : "";
      });
      return plainIndex;
    },
    /**
     * Текущий объект
     *
     * @returns {object} Текущий объект для загрузки
     */
    node() {
      return this.plainIndex.find((e) =>
        this.context
          ? e.path === this.context.routePath ||
            e.href === this.context.routePath
          : undefined
      );
    },
    /**
     * Объекты одного уровня с текущим
     *
     * @returns {object[]} Массив объектов
     */
    siblings() {
      return jsel(this.tree).selectAll(
        `//*[@id="${this.node.id}"]/preceding-sibling::*[@id]|//*[@id="${this.node.id}"]|//*[@id="${this.node.id}"]/following-sibling::*[@id]`
      );
    },
    /**
     * Вычисление текущего пути
     *
     * @returns {string} Путь
     */
    routePath() {
      return this.context ? this.context.routePath : "";
    },
    /**
     * Вычисление массива первого уровня
     *
     * @returns {object[]} Массив объектов первого уровня
     */
    data() {
      return this.tree ? this.tree.data : [];
    },
    /**
     * Вычисление основной иконки
     *
     * @returns {string} Иконка
     */
    icon() {
      return this.tree ? this.tree.icon : "";
    },
    /**
     * Вычисление основного описания
     *
     * @returns {string} Описание
     */
    description() {
      return this.tree ? this.tree.description : "";
    },
  },
  actions: {
    /**
     * Загрузка данных в tree
     */
    async initIndex() {
      [this.tree] = await (
        await fetch("index.json", { cache: "no-store" })
      ).json();
    },
    /**
     * Вычисленние пути
     *
     * @param {object} item Объект вычисления
     * @returns {string} Путь
     */
    href: (item) => (item.href ? item.href : item.path),
    /**
     * Вычисление заголовка
     *
     * @param {object} item Объект вычисления
     * @returns {string} Заголовок
     */
    title: (item) => (item.title ? item.title : item.value),
  },
});
