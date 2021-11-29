/**
 * Обработчик регулярных выражений в селекторах
 *
 * @param {object} elem Элемент
 * @param {number} i Индекс
 * @param {string[]} match Регулярное выражение в 4-ом элементе массива
 * @returns {boolean} Совпадает или нет
 */
export default function regex(elem, i, match) {
  /**
   * Регулярка, порезанная на запятые
   *
   * @type {string[]}
   */
  const matchParams = match[3].split(",");
  /**
   * Валидные метки
   *
   * @type {RegExp}
   */
  const validLabels = /^(data|css):/;
  /**
   * Аттрибуты
   *
   * @type {object}
   */
  const attr = {
    method: matchParams[0].match(validLabels)
      ? matchParams[0].split(":")[0]
      : "attr",
    property: matchParams.shift().replace(validLabels, ""),
  };
  /**
   * Флаги
   *
   * @type {string}
   */
  const regexFlags = "ig";
  /**
   * Подготовленная регулярка
   *
   * @type {RegExp}
   */
  const regexp = new RegExp(
    matchParams.join("").replace(/^\s+|\s+$/g, ""),
    regexFlags
  );
  return regexp.test($(elem)[attr.method](attr.property));
}
