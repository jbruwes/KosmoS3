import { boot } from "quasar/wrappers";

export default boot(() => {
  document.getElementById("loader")?.remove();
});
