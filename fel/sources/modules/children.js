import jsel from "jsel";

/**
 * Получение массива дочерних объектов
 *
 * @param {object} index Структура сайта
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
export default function getChildren(
  index,
  deep,
  length,
  reveal,
  sort,
  path,
  children,
  attr,
  axe
) {
  const hash = decodeURIComponent(window.location.pathname)
    .replace(/_/g, " ")
    .replace(/%2f/g, "/")
    .replace(/%2F/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
  let lChildren = null;
  let lAttr = attr;
  let dataHashes = $.trim(path);
  let dataChildren = [];
  /**
   * Тримминг и убирание кодов из путей, по которым ищутся дочерние элементы
   *
   * @param {string} value Значение пути
   * @returns {string} Обработанный путь
   */
  function mapDataHash(value) {
    return decodeURIComponent($.trim(value))
      .replace(/_/g, " ")
      .replace(/\/+/g, "/")
      .replace(/^\/+|\/+$/g, "");
  }
  /**
   * Вычисление пути до дочернего объекта
   *
   * @param {object} pValue Дочерний объект
   * @returns {string} Путь до дочернего объекта
   */
  function calchash(pValue) {
    let lValue = pValue;
    let localHash = [];
    while (lValue.$level > 2) {
      lValue = jsel(index[0]).select(`//*[@id="${lValue.$parent}"]`);
      localHash.unshift(lValue.value.replace(/\s/g, "_"));
    }
    localHash = localHash.join("/");
    return localHash ? `${localHash}/` : "";
  }
  /**
   * Нахождение дочерних объектов по каждому пути
   *
   * @param {string} dataHash Значение пути по которому ищутся дочерние объекты
   */
  function eachDataHash(dataHash) {
    /**
     * Пересчет аттрибутов для каждого дочернего объекта
     *
     * @param {object} pValue Дочерний объект
     * @returns {object} Обработанный дочерний объект
     */
    function mapDataChildren(pValue) {
      const lValue = pValue;
      let localHash = null;
      if (deep || axe) localHash = calchash(lValue);
      else localHash = dataHash ? `${dataHash.replace(/\s/g, "_")}/` : "";
      lValue.$href = `/${localHash}${
        (lAttr || ((deep || axe) && localHash)) && lValue.$level > 1
          ? `${lValue.value.replace(/\s/g, "_")}/`
          : ""
      }`;
      lValue.$header = lValue.title ? lValue.title : lValue.value;
      lValue.$icon = lValue.icon ? lValue.icon : "linkify";
      lValue.$backgroundImage = lValue.image
        ? `background-image:url(${lValue.image});`
        : "";
      lValue.$miniBasicDate = `${
        '<span class="ui mini basic label" style="margin:0">' +
        '<i class="calendar alternate outline icon"></i>'
      }${new Date(
        lValue.date ? lValue.date : lValue.lastmod
      ).toLocaleDateString()}</span>`;
      lValue.$date = `${
        '<span class="ui label">' +
        '<i class="calendar alternate outline icon"></i>'
      }${new Date(
        lValue.date ? lValue.date : lValue.lastmod
      ).toLocaleDateString()}</span>`;
      return lValue;
    }
    try {
      if (
        typeof children === "undefined" ||
        children === null ||
        children === ""
      )
        lChildren = "";
      else lChildren = children ? "[*]" : "[not(*)]";
      $.merge(
        dataChildren,
        $.map(
          jsel(index[0]).selectAll(
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
          mapDataChildren
        )
      );
    } catch (e) {
      // console.log(e.message);
    }
  }
  /**
   * Вычисление псевдослучайного числа для перемешивания дочерних объектов
   *
   * @returns {number} Псевдослучайное число
   */
  function randomSort() {
    return 0.5 - Math.random();
  }
  /**
   * Сортировка дочерних объектов по дате создания
   *
   * @param {Date} a Первая дата для сравнения
   * @param {Date} b Вторая дата для сравнения
   * @returns {number} Результат сравнения
   */
  function dateSort(a, b) {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  }
  if (!lAttr) lAttr = "";
  if (!dataHashes) dataHashes = hash;
  dataHashes = $.map(dataHashes.split(","), mapDataHash);
  dataHashes.forEach(eachDataHash);
  if (lAttr && !axe) {
    dataChildren = dataChildren.filter(
      (element) => element.$href.replace(/^\/|\/$/g, "") !== hash
    );
  }
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
      dataChildren.sort(randomSort);
      break;
    case "date":
      dataChildren.sort(dateSort);
      break;
    default:
  }
  return dataChildren;
}
