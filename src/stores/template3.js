import { ref } from "vue";
import {
  get,
  set,
  watchTriggerable,
  isDefined,
  useArrayFind,
} from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import kosmos3 from "./kosmos3";

export default defineStore("template3", () => {
  const store = kosmos3();
  const { template } = storeToRefs(store);
  const id = ref();
  const item = useArrayFind(template, ({ id: pId }) => pId === get(id));
  const breakpoint = ref();
  const { trigger } = watchTriggerable(
    () => !!get(template).length,
    () => {
      const { id: lId } = get(template, 0) || {};
      set(id, lId);
    }
  );
  if (get(template).length) trigger();
  /**
   * @param {object} pattern новые значения
   * @param {object} map карта префиксов
   * @param {string} mask маска
   */
  const toClasses = (pattern, map, mask) => {
    const dynaMap = structuredClone(map);
    const prefixes = Object.keys(map);
    let buffer = [];
    /**
     *
     * @param {Array} vector текущий проверочный вектор
     * @param {string} vector."0" кандидат для проверки
     * @param {string} curPrefix текущий префикс
     */
    const mutateMap = ([candidate], curPrefix) => {
      /**
       *
       * @param {object} candidate объект кандидата
       * @param {string} candidate.value значение кандидата
       */
      const mutateCandidate = ({ value }) => {
        /**
         *
         * @param {string} pValue1 значение кандидата
         * @param {object} checker объект для сравнения
         * @param {string} checker.value значение для сравнения
         * @returns {boolean} равенство
         */
        const compareValues = (pValue1, { value: pValue2 }) =>
          pValue1 === pValue2;
        if (
          value &&
          map[curPrefix].every((element) =>
            compareValues(value, pattern[element])
          )
        ) {
          dynaMap[curPrefix].forEach((checker) => {
            prefixes.forEach((prefix) => {
              if (curPrefix !== prefix) {
                const curCheckers = dynaMap[prefix];
                const i = curCheckers.indexOf(checker);
                if (i !== -1) {
                  curCheckers.splice(i, 1);
                  if (curCheckers.indexOf(curPrefix) === -1)
                    curCheckers.push(curPrefix);
                }
              }
            });
          });
          buffer = buffer.filter(
            ([prefix]) =>
              !dynaMap[curPrefix].find((checker) => prefix === checker)
          );
          buffer.push([curPrefix, value]);
        }
      };
      mutateCandidate(pattern[candidate]);
    };
    get(item).classes = get(item).classes.filter(
      (aclass) => !new RegExp(`^(${prefixes.join("|")})-${mask}$`).test(aclass)
    );
    prefixes.reverse().forEach((curPrefix) => {
      mutateMap(map[curPrefix], curPrefix);
    });
    buffer.forEach(([key, value]) => {
      get(item).classes.push(`${key}-${value}`);
    });
  };
  /**
   *
   * @param {object} map карта префиксов
   * @param {string} mask маска
   * @returns {object} объект значений
   */
  const fromClasses = (map, mask) => {
    const keys = Object.keys(map);
    const result = {};
    keys.forEach((key) => {
      const value = (
        isDefined(item)
          ? get(item).classes.find((element) =>
              new RegExp(`^${key}-${mask}$`).test(element)
            ) || ""
          : ""
      ).replace(new RegExp(`^${key}-`), "");
      if (value)
        map[key].forEach((element) => {
          result[element] = { value };
        });
    });
    /**
     *
     * @param {object} element объект для рассчета
     * @param {string} element.value значение
     * @returns {object} рассчетный объект
     */
    const setSizeType = ({ value = "" }) => ({
      value,
      type: value === "auto" ? 1 : 2 * !!value,
      size: Number((value === "auto" ? "0" : value || "0").replace(/^n/, "-")),
    });
    /**
     *
     * @param {Array} keys ключи
     * @param {string} keys."0" первый ключ
     * @returns {object} общий результат
     */
    const calcResult = ([first]) =>
      Object.fromEntries(
        map[first].map((element) => [
          element,
          setSizeType(result[element] || {}),
        ])
      );
    return calcResult(keys);
  };
  /**
   *
   * @param {string} pK ключ
   * @param {object} v значение
   * @param {object} pMap карта префиксов
   * @param {string} mask маска
   * @returns {object} рассчетный объект
   */
  const cmpSizeType = (pK, v, pMap, mask) => {
    const k = `${pK}-${get(breakpoint) || ""}`.replace(/-$/, "");
    const map = Object.fromEntries(
      Object.entries(pMap).map(([key, value]) => [
        `${key}-${get(breakpoint) || ""}`.replace(/-$/, ""),
        value.map((e) => `${e}-${get(breakpoint) || ""}`.replace(/-$/, "")),
      ])
    );
    return {
      ...v,
      /** @returns {string} размер */
      get size() {
        const { size } = fromClasses(map, mask)[k] || {};
        return size;
      },
      /** @param {number} value размер */
      set size(value) {
        const result = fromClasses(map, mask);
        result[k].value = {
          0: "",
          1: "auto",
          2: value.toString().replace(/^-/, "n"),
        }[this.type];
        toClasses(result, map, mask);
      },
      /** @returns {number} тип */
      get type() {
        const { type } = fromClasses(map, mask)[k] || {};
        return type;
      },
      /** @param {number} value тип */
      set type(value) {
        const result = fromClasses(map, mask);
        result[k].value = {
          0: "",
          1: "auto",
          2: this.size.toString().replace(/^-/, "n"),
        }[value];
        toClasses(result, map, mask);
      },
    };
  };
  return {
    ...{ id, item, breakpoint },
    ...{ fromClasses, toClasses, cmpSizeType },
  };
});
