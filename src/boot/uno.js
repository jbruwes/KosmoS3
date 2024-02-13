import initUnocssRuntime from "@unocss/runtime";
import { boot } from "quasar/wrappers";

import unocssConfig from "~/uno.config";

export default boot(() => {
  initUnocssRuntime({
    autoPrefix: true,
    defaults: unocssConfig,
  });
});
