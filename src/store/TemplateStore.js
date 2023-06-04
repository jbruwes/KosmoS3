import { ref, computed } from "vue";
import {
  get,
  set,
  watchTriggerable,
  useArrayFind,
  useArrayFindIndex,
} from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import app from "./app";

export default defineStore("template3", () => {
  const store = app();
  const { template } = storeToRefs(store);
  const visibleTemplate = computed(() =>
    get(template).filter((element) => element.params.visible)
  );

  const konvaWidth = ref();
  const konvaHeight = ref();
  const realResponsiveWidth = ref();
  const scrollY = ref();
  const layerId = ref();
  const layerIndex = useArrayFindIndex(
    template,
    ({ id: pId }) => pId === get(layerId)
  );
  const layer = useArrayFind(template, ({ id: pId }) => pId === get(layerId));
  const { trigger } = watchTriggerable(
    () => !!get(template).length,
    () => {
      const { id: lId } = get(template, 0) ?? {};
      set(layerId, lId);
    }
  );
  if (get(template).length) trigger();

  /** @constant {number} responsiveWidth рассчетная ширина адаптивного контейнера плюс ширина бордюра */
  const responsiveWidth = computed(() => get(realResponsiveWidth) + 8);
  const cntStatic = computed(
    () =>
      get(visibleTemplate).filter(
        ({ params: { position } = {} } = {}) => !position
      ).length || 1
  );
  const fullHeight = computed(() => get(cntStatic) * get(konvaHeight));
  /**
   *
   * @param {boolean} responsive адаптивность
   * @returns {number} ширина контейнера
   */
  const containerWidth = (responsive) =>
    get(responsive ? responsiveWidth : konvaWidth);
  /**
   *
   * @param {number} position тип позиционирования
   * @returns {number} высота контейнера
   */
  const containerHeight = (position) =>
    get(position === 1 ? fullHeight : konvaHeight);
  /**
   *
   * @param {boolean} responsive адаптивность
   * @returns {number} адаптивный сдвиг по горизонтали
   */
  const calcOffsetX = (responsive) =>
    (responsive > 0) * ((get(konvaWidth) - get(responsiveWidth)) / 2);
  /**
   *
   * @param {number} pPosition тип позиционирования
   * @param {number} pIndex порядковый номер в шаблоне
   * @returns {number} адаптивный сдвиг по вертикали
   */
  const calcOffsetY = (pPosition, pIndex) =>
    [
      get(visibleTemplate).filter(
        ({ params: { position } = {} }, index) => index < pIndex && !position
      ).length * get(konvaHeight),
      0,
      pIndex === undefined ? 0 : get(scrollY),
    ][pPosition];
  /**
   * @param {number} value ширина px
   * @param {boolean} responsive адаптивность
   * @returns {number} ширина %
   */
  const calcXPct = (value, responsive) =>
    (100 * (value - calcOffsetX(responsive))) / containerWidth(responsive);
  /**
   * @param {number} value высота px
   * @param {number} position тип позиционирования
   * @param {number} index порядковый номер в шаблоне
   * @returns {number} высота %
   */
  const calcYPct = (value, position, index) =>
    (100 * (value - calcOffsetY(position, index))) / containerHeight(position);
  /**
   * @param {number} value ширина %
   * @param {boolean} responsive адаптивность
   * @returns {number} ширина px
   */
  const calcXPx = (value, responsive) =>
    calcOffsetX(responsive) + (value * containerWidth(responsive)) / 100;
  /**
   * @param {number} value высота %
   * @param {number} position тип позиционирования
   * @param {number} index порядковый номер в шаблоне
   * @returns {number} высота px
   */
  const calcYPx = (value, position, index) =>
    calcOffsetY(position, index) + (value * containerHeight(position)) / 100;

  return {
    ...{ layerId, layerIndex, layer },
    ...{
      konvaWidth,
      konvaHeight,
      realResponsiveWidth,
      scrollY,
      visibleTemplate,
      cntStatic,
      fullHeight,
    },
    ...{
      containerWidth,
      calcOffsetX,
      calcOffsetY,
      calcXPct,
      calcYPct,
      calcXPx,
      calcYPx,
    },
  };
});
