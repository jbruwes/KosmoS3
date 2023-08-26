import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  /**
   *
   */
  state: () => ({
    counter: 0,
  }),
  getters: {
    /**
     *
     * @param state
     */
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    /**
     *
     */
    increment() {
      this.counter++;
    },
  },
});
