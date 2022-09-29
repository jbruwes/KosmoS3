import { ref } from "vue";
import { defineStore } from "pinia";

export default defineStore("kosmos3", () => {
  const io = ref(undefined);
  const auth = ref(false);
  return { io, auth };
});
