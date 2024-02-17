// import "@unocss/reset/tailwind.css";
// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css";

import initUnocssRuntime from "@unocss/runtime";
import { boot } from "quasar/wrappers";

import unocssConfig from "~/uno.config";

export default boot(() => {
  initUnocssRuntime({
    autoPrefix: true,
    defaults: unocssConfig,
    bypassDefined: true,
  });
});
