import { computedWithControl, get, set, useFetch } from "@vueuse/core";
import DOMPurify from "dompurify";
import jsel from "jsel";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export default defineStore("app", () => {
  const { data: treeData, statusCode: treeStatusCode } =
    useFetch("data.json").json();
  const tree = ref({});
  watch(treeData, (value) => {
    if (get(treeStatusCode) === 200) set(tree, value[0]);
  });
  const pageLen = ref(0);
  const routePath = ref(undefined);
  const routeParams = ref(undefined);
  /**
   * Вычисление вектора
   * @param {object} item Объект вычисления
   * @returns {object[]} Вектор
   */
  const getVector = (item) =>
    jsel(get(tree)).selectAll(`//*[@id="${item.id}"]/ancestor-or-self::*[@id]`);
  const list = computed(() => jsel(get(tree)).selectAll("//*[@id]"));
  /**
   * Вычисленние роута
   * @param {object} item Объект вычисления
   * @returns {string} Путь
   */
  const getRoute = (item) =>
    item.route
      ? `/${item.route
          .trim()
          .replace(/\s/g, "_")
          .replace(/^\/+|\/+$/g, "")}/`
      : "";
  /**
   * Вычисленние пути
   * @param {object} item Объект вычисления
   * @returns {string} Путь
   */
  const getPath = (item) => {
    let lPath = getVector(item).map((e) =>
      e.value.trim().replace(/\s/g, "_").replace(/\//g, ""),
    );
    lPath.shift();
    lPath = lPath.join("/");
    return lPath ? `/${lPath}/` : "/";
  };
  /**
   * Вычисленние ссылки
   * @param {object} item Объект вычисления
   * @returns {string} Путь
   */
  const getHref = (item) =>
    item.url
      ? `/${item.url
          .trim()
          .replace(/\s/g, "_")
          .replace(/^\/+|\/+$/g, "")}/`
      : getPath(item);

  /**
   * Вычисление заголовка
   * @param {object} item Объект вычисления
   * @returns {string} Заголовок
   */
  const getTitle = (item) => (item.title ? item.title : item.value);
  /**
   * Вычисление родителя
   * @param {object} item Объект вычисления
   * @returns {object} Родитель
   */
  const getParent = (item) =>
    jsel(get(tree)).select(`//*[@id="${item.id}"]/../parent::*[@id]`);
  /**
   * Вычисление объектов одного уровня
   * @param {object} item Объект вычисления
   * @returns {object[]} Объекты одного уровня
   */
  const getSiblings = (item) =>
    jsel(get(tree)).selectAll(
      `//*[@id="${item.id}"]/preceding-sibling::*[@id]|//*[@id="${item.id}"]|//*[@id="${item.id}"]/following-sibling::*[@id]`,
    );
  const nextItem = computed(
    () =>
      get(list).find((element) =>
        [getPath(element), getHref(element)].includes(get(routePath)),
      ) || {},
  );
  const nextId = computed(() => get(nextItem).id);
  const { data: templateData, statusCode: templateStatusCode } = useFetch(
    computed(() => `${encodeURIComponent(get(nextId))}.htm`),
    {
      /**
       *
       * @param {object} root0 Объект параметров
       * @param {Function} root0.cancel Ф-ция отмены запроса
       */
      beforeFetch({ cancel }) {
        if (!get(pageLen) || get(nextItem).page) cancel();
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
    },
  );
  const item = computedWithControl(
    () => get(templateData),
    () => get(nextItem),
  );
  watch(nextId, (newNextId) => {
    if (newNextId && (!get(pageLen) || get(nextItem).page)) item.trigger();
  });
  const template = computedWithControl(
    () => get(item),
    () =>
      !get(templateStatusCode) || get(templateStatusCode) === 200
        ? get(templateData)
        : "<div></div>",
  );
  const siblings = computed(() => getSiblings(get(item)));
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
  const path = computed(() => getPath(get(item)));
  const treePath = computed(() => getPath(get(tree)));
  const parentPath = computed(() => getPath(get(parent)));
  const href = computed(() => getHref(get(item)));
  const treeHref = computed(() => getHref(get(tree)));
  const parentHref = computed(() => getHref(get(parent)));
  const image = computed(() => get(item).image);
  const treeImage = computed(() => get(item).tree);
  const parentImage = computed(() => get(parent).image);
  /**
   * Получение массива дочерних объектов
   * @param {object} x аттрибуты xpath
   * @param {(number | boolean)} x.deep Флаг использования рекурсии
   *  по дочерним объектам
   * @param {number} x.length Количество дочерних объектов для изъятия
   * @param {(number | boolean)} x.reveal Флаг указывающий показывать ли
   *  скрытые объекты
   * @param {string} x.sort Флаг указывающий на необходимость
   *  отсортировать результат
   * @param {string} x.path CSV путей до дочерних объектов
   * @param {(number | boolean)} x.children Выбирать папки или файлы?
   * Если путое значение то всё
   * @param {string} [x.selector] Путь xpath
   * @param {string} x.axe Заведует включением параметра xpath axe
   * @returns {object[]} Массив дочерних объектов
   */
  const getItems = ({
    deep,
    length,
    reveal,
    sort,
    path: pPath,
    children,
    selector = "*[@id]",
    axe,
  }) => {
    let lChildren;
    let dataChildren = [];
    const dataHashes = (
      Array.isArray(pPath) ? pPath : [pPath || get(path) || ""]
    ).map((pValue) =>
      decodeURIComponent(pValue.trim())
        .replace(/_/g, " ")
        .replace(/\/+/g, "/")
        .replace(/^\/+|\/+$/g, ""),
    );
    if (children === undefined) lChildren = "";
    else lChildren = children ? "[*]" : "[not(*)]";
    dataHashes.forEach((dataHash) => {
      try {
        dataChildren = [
          ...dataChildren,
          ...jsel(get(tree)).selectAll(
            `/*${
              dataHash
                ? `/data/*[@value="${dataHash
                    .split("/")
                    .join('"]/data/*[@value="')}"]`
                : ""
            }${selector && !axe ? "/data" : ""}${
              deep && selector && !axe ? "/" : ""
            }${selector ? "/" : ""}${axe ? `${axe}::` : ""}${selector}${
              selector && !axe && !reveal ? "[@visible=1]" : ""
            }${lChildren}`,
          ),
        ];
      } catch (e) {
        // console.log(e.message);
      }
    });
    // if (selector && !axe)
    //  dataChildren = dataChildren.filter(
    //    (element) => element.$href.replace(/^\/+|\/+$/g, "") !== hash
    //  );
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
  };
  const children = computed(() => get(item).data);
  return {
    ...{
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
    },
    ...{
      getRoute,
      getPath,
      getHref,
      getTitle,
      getVector,
      getParent,
      getSiblings,
      getItems,
    },
  };
});
