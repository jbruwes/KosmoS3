import { ref, computed } from "vue";
import { get, useArrayFindIndex, useArrayFilter } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import app from "./app";

export default defineStore("template3", () => {
  const store = app();
  const { template } = storeToRefs(store);
  const visibleTemplate = useArrayFilter(
    template,
    ({ params: { visible } = {} } = {}) => visible
  );
  const visibleTemplateStatic = useArrayFilter(
    visibleTemplate,
    ({ params: { position } = {} } = {}) => !position
  );
  const konvaWidth = ref();
  const konvaHeight = ref();
  const realResponsiveWidth = ref();
  const scrollY = ref();
  const itemId = ref();
  const itemIndex = useArrayFindIndex(template, ({ id }) => id === get(itemId));

  /** @constant {number} responsiveWidth рассчетная ширина адаптивного контейнера плюс ширина бордюра */
  const responsiveWidth = computed(() => get(realResponsiveWidth) + 8);
  const cntStatic = computed(() => get(visibleTemplateStatic).length || 1);
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

  /**
   *
   * @param {object} value слой
   * @returns {object} нормализованный слой
   */
  const normLayer = (value) => {
    const layer = {
      ...value,
      params: {
        ...value.params,
        /** @returns {boolean} видимость x */
        get visible() {
          const { visible } = layer;
          return visible;
        },
        /** @param {boolean} val видимость */
        set visible(val) {
          layer.visible = val;
        },
        /** @returns {number} сдвиг x */
        get offsetX() {
          const { width, offsetX, scaleX } = layer;
          return (width - offsetX) * scaleX;
        },
        /** @returns {number} сдвиг y */
        get offsetY() {
          const { height, offsetY, scaleY } = layer;
          return (height - offsetY) * scaleY;
        },
        /** @returns {number} позиция в массиве */
        get index() {
          const { id: layerId } = layer;
          return get(visibleTemplate).findIndex(({ id }) => id === layerId);
        },
      },
      /** @returns {number} отступ слева */
      get x() {
        const {
          params: { width, responsive, offsetX },
        } = this;
        return calcXPx(width[0], responsive) + offsetX;
      },
      /** @param {number} val отступ слева px */
      set x(val) {
        const {
          params: { width, responsive },
        } = this;
        width[0] = calcXPct(val, responsive);
      },
      /** @returns {number} отступ сверху */
      get y() {
        const {
          params: { height, position, index, offsetY },
        } = this;
        return calcYPx(height[0], position, index) + offsetY;
      },
      /** @param {number} val отступ сверху px */
      set y(val) {
        const {
          params: { height, position, index },
        } = this;
        height[0] = calcYPct(val, position, index);
      },

      /** @returns {number} масштаб по х */
      get scaleX() {
        const {
          params: { width, responsive },
        } = this;
        return calcXPx(width[1] - width[0], -responsive);
      },
      /** @param {number} val масштаб по х */
      set scaleX(val) {
        const {
          params: { width, responsive },
        } = this;
        width[1] = width[0] + calcXPct(val, -responsive);
      },

      /** @returns {number} масштаб по y */
      get scaleY() {
        const {
          params: { height, position },
        } = this;
        return calcYPx(height[1] - height[0], position);
      },
      /** @param {number} val масштаб по y */
      set scaleY(val) {
        const {
          params: { height, position },
        } = this;
        height[1] = height[0] + calcYPct(val, position);
      },
      /**
       * проверка невыхода за габариты при изменении положения
       * @param {object} pos новые координаты
       * @param {number} pos.x новые координаты x
       * @param {number} pos.y новые координаты y
       * @returns {object} разрешенные координаты
       */
      dragBoundFunc({ x: posX, y: posY }) {
        const {
          attrs: {
            scaleX,
            scaleY,
            params: { offsetX, offsetY, position, responsive, index },
          },
        } = this;
        const top = calcYPct(posY - offsetY, position, index);
        const bottom = top + calcYPct(scaleY, position);
        const left = calcXPct(posX - offsetX, responsive);
        const right = left + calcXPct(scaleX, -responsive);
        let x = posX;
        if (left.toFixed(2) < 0) x = offsetX + calcOffsetX(responsive);
        if (right.toFixed(2) > 100)
          x =
            containerWidth(responsive) -
            scaleX +
            offsetX +
            calcOffsetX(responsive);
        let y = posY;
        if (top.toFixed(2) < 0) y = offsetY + calcOffsetY(position, index);
        if (bottom.toFixed(2) > 100)
          y =
            get(konvaHeight) - scaleY + offsetY + calcOffsetY(position, index);
        return { x, y };
      },
    };
    return layer;
  };

  return {
    ...{ itemId, itemIndex },
    ...{
      konvaWidth,
      konvaHeight,
      realResponsiveWidth,
      scrollY,
      visibleTemplate,
      cntStatic,
      fullHeight,
    },
    ...{ calcXPct, calcYPct, normLayer },
  };
});
