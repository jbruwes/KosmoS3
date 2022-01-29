import onhashchange from "./onhashchange";
import glightbox from "./glightbox";
/**
 * Загрузка нужного контента в зависимости от урл
 *
 * @param {*[]} usrScripts Массив промисов пользовательских подгружаемых
 *  скриптов
 * @param {object.<*>} scripts Объект с промисами подгружаемых скриптов
 * @param {object} index Структура сайта
 */
export default async function cont(usrScripts, scripts, index) {
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
   * @param {object} valueOfElement Текущий элемент структуры сайта
   * @returns {boolean} Результат проверки
   */
  function findId(valueOfElement) {
    if (valueOfElement.value === splitHash[i]) {
      id = valueOfElement.id;
      value = valueOfElement.value;
      child = valueOfElement.data;
      return false;
    }
    return true;
  }
  if (hash) {
    for (i = 0; i < splitHash.length; i += 1) {
      id = null;
      child.forEach(findId);
      if (!id) break;
    }
  } else id = index[0].id;
  if (id) {
    let html = "";
    try {
      html = await fetch(`${encodeURIComponent(id)}.htm`, {
        cache: "no-store",
      });
      html = html.status === 200 ? await html.text() : "";
    } catch (err) {
      html = "";
    }
    document.querySelector("#content>main").innerHTML = html;
    document.title = value;
    glightbox("#content>main");
    onhashchange(usrScripts, scripts, index);
    if (!window.location.hash) window.scrollTo(0, 0);
  }
}
