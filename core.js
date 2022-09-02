import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useFetch, get, computedWithControl } from "@vueuse/core";
import jsel from "jsel";
import DOMPurify from "dompurify";

export default defineStore("core", () => {
  const { data: treeData, statusCode: treeStatusCode } =
    useFetch("/index.json").json();
  const tree = computedWithControl(
    () => get(treeData),
    () => (get(treeStatusCode) === 200 ? get(treeData)[0] : {})
  );
  const pageLen = ref(0);
  const routePath = ref("");
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
  const getPath = (item) => (item.href ? item.href : item.path);
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
        dataChildren = [
          ...dataChildren,
          ...jsel(get(tree)).selectAll(
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
          ),
        ];
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
  const value = computed(() => get(item).value);
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

  const { data: templateData, statusCode: templateStatusCode } = useFetch(
    computed(() => `/${encodeURIComponent(get(id))}.htm`),
    {
      /**
       *
       * @param {object} root0 Объект параметров
       * @param {Function} root0.cancel Ф-ция отмены запроса
       */
      beforeFetch({ cancel }) {
        if (!get(pageLen)) cancel();
      },
      /**
       *
       * @param {object} ctx Контекст запроса
       * @returns {object} Возврат измененного контекста
       */
      afterFetch(ctx) {
        ctx.data = DOMPurify.sanitize(ctx.data, {
          ADD_TAGS: ["iframe"],
          ADD_ATTR: [
            "target",
            "allow",
            "allowfullscreen",
            "frameborder",
            "scrolling",
          ],
          CUSTOM_ELEMENT_HANDLING: {
            tagNameCheck: /^v-/,
            attributeNameCheck: /\w+/,
            allowCustomizedBuiltInElements: true,
          },
        });
        return ctx;
      },
      refetch: true,
    }
  );
  const template = computedWithControl(
    () => get(templateData),
    () =>
      !get(templateStatusCode) || get(templateStatusCode) === 200
        ? get(templateData)
        : "<div></div>"
  );

  return {
    value,
    template,
    tree,
    pageLen,
    routePath,
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
    getPath,
    getTitle,
    getVector,
    getParent,
    getSiblings,
    getItems,
  };
});
