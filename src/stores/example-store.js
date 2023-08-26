import { defineStore } from "pinia";

const useCounterStore = defineStore("counter", {
  /**
   * @returns {object} - объект состояния
   */
  state: () => ({
    counter: 0,
  }),
  getters: {
    /**
     *
     * @param {object} state - объект состояния
     * @returns {number} - двойной счетчик
     */
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    /**
     *
     */
    increment() {
      this.counter += 1;
    },
  },
});

export default useCounterStore;
