import onhashchange from "./onhashchange";
import lightcase from "./lightcase";
/**
 * Загрузка нужного контента в зависимости от урл
 *
 * @param {*[]} usrScripts Массив промисов пользовательских подгружаемых
 *  скриптов
 * @param {object.<*>} scripts Объект с промисами подгружаемых скриптов
 * @param {object} index Структура сайта
 */
export default function cont(usrScripts, scripts, index) {
  /**
   * Dom путь
   *
   * @constant {string}
   */
  const sel = "#content>main";
  /**
   * Строка пути относительно корня сайта
   *
   * @constant {string}
   */
  const hash = decodeURIComponent(window.location.pathname)
    .replace(/_/g, " ")
    .replace(/%2f/g, "/")
    .replace(/%2F/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
  /**
   * Массив из частей урла
   *
   * @type {string[]}
   */
  const splitHash = hash.split("/");
  /**
   * Массив объектов первого уровня в структуре сайта
   *
   * @type {object[]}
   */
  let child = index[0].data;
  /**
   * @type {string} Название корневой рубрики
   */
  let { value } = index[0];
  /**
   * @type {string} Текущий id
   */
  let id = null;
  /**
   * @type {number} Индекс для цикла
   */
  let i = null;
  /**
   * Функция проверки соответствия текущего элемента сегменту из урла
   *
   * @param {number} indexInArray Индекс
   * @param {object} valueOfElement Текущий элемент структуры сайта
   * @returns {boolean} Результат проверки
   */
  function findId(indexInArray, valueOfElement) {
    if (valueOfElement.value === splitHash[i]) {
      id = valueOfElement.id;
      value = valueOfElement.value;
      child = valueOfElement.data;
      return false;
    }
    return true;
  }
  /**
   * Обязательные действия после загрузки контента
   */
  function onLoad() {
    document.title = value;
    lightcase(sel);
    onhashchange(usrScripts, scripts, index);
    if (!window.location.hash) $(window).scrollTop(0);
  }
  if (hash) {
    for (i = 0; i < splitHash.length; i += 1) {
      id = null;
      $.each(child, findId);
      if (!id) break;
    }
  } else id = index[0].id;
  if (id) $(sel).load(`${encodeURIComponent(id)}.htm`, onLoad);
}
