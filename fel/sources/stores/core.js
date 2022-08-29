import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useFetch, get, set } from "@vueuse/core";
import jsel from "jsel";

export default defineStore("core", () => {
  const tree = ref({});
  const context = ref({});
  const routePath = computed(() => get(context).routePath);
  /**
   * Вычисление вектора
   *
   * @param {object} item Объект вычисления
   * @returns {object[]} Вектор
   */
  const getVector = (item) =>
    jsel(get(tree)).selectAll(`//*[@id="${item.id}"]/ancestor-or-self::*[@id]`);

  const list = computed(() =>
    jsel(get(tree))
      .selectAll("//*[@id]")
      .map((node) => {
        const lNode = node;
        lNode.path = getVector(lNode).map((e) =>
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
        return lNode;
      })
  );
  /**
   * Вычисленние пути
   *
   * @param {object} item Объект вычисления
   * @returns {string} Путь
   */
  const getPath = (item) => (item.path ? item.path : item.href);
  /**
   * Вычисление заголовка
   *
   * @param {object} item Объект вычисления
   * @returns {string} Заголовок
   */
  const getTitle = (item) => (item.title ? item.title : item.value);
  /**
   * Вычисление родителя
   *
   * @param {object} item Объект вычисления
   * @returns {object} Родитель
   */
  const getParent = (item) =>
    jsel(get(tree)).select(`//*[@id="${item.id}"]/../parent::*[@id]`);
  /**
   * Вычисление объектов одного уровня
   *
   * @param {object} item Объект вычисления
   * @returns {object[]} Объекты одного уровня
   */
  const getSiblings = (item) =>
    jsel(get(tree)).selectAll(
      `//*[@id="${item.id}"]/preceding-sibling::*[@id]|//*[@id="${item.id}"]|//*[@id="${item.id}"]/following-sibling::*[@id]`
    );

  const item = computed(
    () =>
      get(list).find(
        (e) => e.path === get(routePath) || e.href === get(routePath)
      ) || {}
  );

  /**
   * Загрузка данных в tree
   */
  async function initIndex() {
    const { data } = await useFetch("index.json").json();
    set(
      tree,
      // (await (await fetch("index.json", { cache: "no-store" })).json())[0]
      get(data)[0]
    );
  }
  /**
   * Получение массива дочерних объектов
   *
   * @param {(number | boolean)} deep Флаг использования рекурсии
   *  по дочерним объектам
   * @param {number} length Количество дочерних объектов для изъятия
   * @param {(number | boolean)} reveal Флаг указывающий показывать ли
   *  скрытые объекты
   * @param {string} sort Флаг указывающий на необходимость
   *  отсортировать результат
   * @param {string} path CSV путей до дочерних объектов
   * @param {(number | boolean)} children Выбирать папки или файлы?
   * Если путое значение то всё
   * @param {string} [attr=""] Путь xpath
   * @param {string} axe Заведует включением параметра xpath axe
   * @returns {object[]} Массив дочерних объектов
   */
  function getItems(deep, length, reveal, sort, path, children, attr, axe) {
    let lChildren = null;
    const lAttr = attr || "";
    let dataChildren = [];
    const dataHashes = (
      Array.isArray(path) ? path : [path || get(routePath) || ""]
    ).map((value) =>
      decodeURIComponent(value.trim())
        .replace(/_/g, " ")
        .replace(/\/+/g, "/")
        .replace(/^\/+|\/+$/g, "")
    );
    dataHashes.forEach((dataHash) => {
      try {
        if (children === undefined || children === null || children === "")
          lChildren = "";
        else lChildren = children ? "[*]" : "[not(*)]";
        $.merge(
          dataChildren,
          jsel(get(tree)).selectAll(
            `/*${
              dataHash
                ? `/data/*[@value="${dataHash
                    .split("/")
                    .join('"]/data/*[@value="')}"]`
                : ""
            }${lAttr && !axe ? "/data" : ""}${
              deep && lAttr && !axe ? "/" : ""
            }${lAttr ? "/" : ""}${axe ? `${axe}::` : ""}${lAttr}${
              lAttr && !axe && !reveal ? "[@visible=1]" : ""
            }${lChildren}`
          )
        );
      } catch (e) {
        // console.log(e.message);
      }
    });
    // if (lAttr && !axe) {
    //  dataChildren = dataChildren.filter(
    //    (element) => element.$href.replace(/^\/+|\/+$/g, "") !== hash
    //  );
    // }
    if (
      length &&
      !Number.isNaN(Number(length)) &&
      length > 0 &&
      length < dataChildren.length
    ) {
      dataChildren = dataChildren.slice(0, length);
    }
    switch (sort) {
      case "random":
        dataChildren.sort(() => 0.5 - Math.random());
        break;
      case "date":
        dataChildren.sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          return 0;
        });
        break;
      default:
    }
    return dataChildren;
  }

  const siblings = computed(() => getSiblings(get(item)));
  const children = computed(() => get(item).data);
  const treeChildren = computed(() => get(tree).data);
  const parent = computed(() => getParent(get(item)));
  const parentChildren = computed(() => get(parent).data);
  const vector = computed(() => getVector(get(item)));
  const id = computed(() => get(item).id);
  const title = computed(() => getTitle(get(item)));
  const treeTitle = computed(() => getTitle(get(tree)));
  const parentTitle = computed(() => getTitle(get(parent)));
  const description = computed(() => get(item).description);
  const keywords = computed(() => get(item).keywords);
  const treeDescription = computed(() => get(tree).description);
  const parentDescription = computed(() => get(parent).description);
  const icon = computed(() => get(item).icon);
  const treeIcon = computed(() => get(tree).icon);
  const parentIcon = computed(() => get(parent).icon);
  const path = computed(() => getPath(get(item)));
  const treePath = computed(() => getPath(get(tree)));
  const parentPath = computed(() => getPath(get(parent)));
  const image = computed(() => get(item).image);
  const treeImage = computed(() => get(item).tree);
  const parentImage = computed(() => get(parent).image);

  return {
    tree,
    context,
    list,
    siblings,
    children,
    treeChildren,
    parentChildren,
    vector,
    parent,
    item,
    id,
    title,
    treeTitle,
    parentTitle,
    description,
    keywords,
    treeDescription,
    parentDescription,
    icon,
    treeIcon,
    parentIcon,
    path,
    treePath,
    parentPath,
    image,
    treeImage,
    parentImage,
    routePath,
    initIndex,
    getPath,
    getTitle,
    getVector,
    getParent,
    getSiblings,
    getItems,
  };
});
