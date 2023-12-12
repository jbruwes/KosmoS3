import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetExt from "@twind/preset-ext";
import presetTailwind from "@twind/preset-tailwind";
import presetTypography from "@twind/preset-typography";

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind(),
    presetTypography(),
    presetExt(),
  ],
});
