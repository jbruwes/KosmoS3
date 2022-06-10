import { defineStore } from "pinia";
import jsel from "jsel";

export default defineStore("core", {
  /**
   * @returns {object} Переменные состояния
   */
  state: () => ({
    index: {
      yandex: "",
      google: "",
      metrika: "",
      analytics: "",
      value: "",
      id: "",
      visible: true,
      date: "",
      image: "",
      $count: 0,
      $parent: 0,
      $level: 1,
      open: true,
      lastmod: "",
      changefreq: "",
      priority: "",
      description: "",
      keywords: "",
      url: "",
      title: "",
      icon: "",
      data: [],
    },
    context: undefined,
  }),
  getters: {
    /**
     * Плоский индекс
     *
     * @returns {object[]} Плоский индекс для поиска
     */
    plainIndex() {
      const plainIndex = jsel(this.index).selectAll("//*[@id]");
      plainIndex.forEach((node) => {
        const lNode = node;
        lNode.path = jsel(this.index).selectAll(
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
      return jsel(this.index).selectAll(
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
  },
  actions: {
    /**
     * Загрузка данных в index
     */
    async initIndex() {
      [this.index] = await (
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
