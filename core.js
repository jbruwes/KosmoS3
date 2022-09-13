import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { useFetch, get, computedWithControl } from "@vueuse/core";
import jsel from "jsel";
import DOMPurify from "dompurify";

export default defineStore("core", () => {
  const { data: treeData, statusCode: treeStatusCode } =
    useFetch("index.json").json();
  const tree = computedWithControl(
    () => get(treeData),
    () => (get(treeStatusCode) === 200 ? get(treeData)[0] : {})
  );
  const pageLen = ref(0);
  const routePath = ref(undefined);
  const routeParams = ref(undefined);
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
        lNode.route = lNode.route ? `/${lNode.route}/` : "";
        return lNode;
      })
  );
  /**
   * Вычисленние пути
   *
   * @param {object} item Объект вычисления
   * @returns {string} Путь
   */
  const getHref = (item) => (item.href ? item.href : item.path);
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

  const nextItem = computed(
    () =>
      get(list).find(
        (e) => e.path === get(routePath) || e.href === get(routePath)
      ) || {}
  );
  const nextId = computed(() => get(nextItem).page || get(nextItem).id);
  const { data: templateData, statusCode: templateStatusCode } = useFetch(
    computed(() => `${encodeURIComponent(get(nextId))}.htm`),
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
  const item = computedWithControl(
    () => get(templateData),
    () => get(nextItem)
  );
  watch(nextId, (newNextId) => {
    if (newNextId && !get(pageLen)) item.trigger();
  });
  const template = computedWithControl(
    () => get(item),
    () =>
      !get(templateStatusCode) || get(templateStatusCode) === 200
        ? get(templateData)
        : "<div></div>"
  );
  const siblings = computed(() => getSiblings(get(item)));
  const children = computed(() => get(item).data);
  const treeChildren = computed(() => get(tree).data);
  const parent = computed(() => getParent(get(item)));
  const parentChildren = computed(() => get(parent).data);
  const vector = computed(() => getVector(get(item)));
  const id = computed(() => get(item).id);
  const value = computed(() => get(item).value);
  const page = computed(() => get(item).page);
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
  const path = computed(() => get(item).path);
  const treePath = computed(() => get(tree).path);
  const parentPath = computed(() => get(parent).path);
  const href = computed(() => getHref(get(item)));
  const treeHref = computed(() => getHref(get(tree)));
  const parentHref = computed(() => getHref(get(parent)));
  const image = computed(() => get(item).image);
  const treeImage = computed(() => get(item).tree);
  const parentImage = computed(() => get(parent).image);

  /**
   * Получение массива дочерних объектов
   *
   * @param {(number | boolean)} pDeep Флаг использования рекурсии
   *  по дочерним объектам
   * @param {number} pLength Количество дочерних объектов для изъятия
   * @param {(number | boolean)} pReveal Флаг указывающий показывать ли
   *  скрытые объекты
   * @param {string} pSort Флаг указывающий на необходимость
   *  отсортировать результат
   * @param {string} pPath CSV путей до дочерних объектов
   * @param {(number | boolean)} pChildren Выбирать папки или файлы?
   * Если путое значение то всё
   * @param {string} [pAttr=""] Путь xpath
   * @param {string} pAxe Заведует включением параметра xpath pAxe
   * @returns {object[]} Массив дочерних объектов
   */
  function getItems(
    pDeep,
    pLength,
    pReveal,
    pSort,
    pPath,
    pChildren,
    pAttr,
    pAxe
  ) {
    let lChildren = null;
    const lAttr = pAttr || "";
    let dataChildren = [];
    const dataHashes = (
      Array.isArray(pPath) ? pPath : [pPath || get(path) || ""]
    ).map((pValue) =>
      decodeURIComponent(pValue.trim())
        .replace(/_/g, " ")
        .replace(/\/+/g, "/")
        .replace(/^\/+|\/+$/g, "")
    );
    dataHashes.forEach((dataHash) => {
      try {
        if (pChildren === undefined) lChildren = "";
        else lChildren = pChildren ? "[*]" : "[not(*)]";
        dataChildren = [
          ...dataChildren,
          ...jsel(get(tree)).selectAll(
            `/*${
              dataHash
                ? `/data/*[@value="${dataHash
                    .split("/")
                    .join('"]/data/*[@value="')}"]`
                : ""
            }${lAttr && !pAxe ? "/data" : ""}${
              pDeep && lAttr && !pAxe ? "/" : ""
            }${lAttr ? "/" : ""}${pAxe ? `${pAxe}::` : ""}${lAttr}${
              lAttr && !pAxe && !pReveal ? "[@visible=1]" : ""
            }${lChildren}`
          ),
        ];
      } catch (e) {
        // console.log(e.message);
      }
    });
    // if (lAttr && !pAxe) {
    //  dataChildren = dataChildren.filter(
    //    (element) => element.$href.replace(/^\/+|\/+$/g, "") !== hash
    //  );
    // }
    if (
      pLength &&
      !Number.isNaN(Number(pLength)) &&
      pLength > 0 &&
      pLength < dataChildren.length
    ) {
      dataChildren = dataChildren.slice(0, pLength);
    }
    switch (pSort) {
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
  return {
    treeData,
    value,
    page,
    template,
    tree,
    pageLen,
    routePath,
    routeParams,
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
    href,
    treeHref,
    parentHref,
    image,
    treeImage,
    parentImage,
    getHref,
    getTitle,
    getVector,
    getParent,
    getSiblings,
    getItems,
  };
});
