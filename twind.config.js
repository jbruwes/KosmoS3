import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetContainerQueries from "@twind/preset-container-queries";
import presetExt from "@twind/preset-ext";
import presetLineClamp from "@twind/preset-line-clamp";
import presetRadixUi from "@twind/preset-radix-ui";
import presetTailwind from "@twind/preset-tailwind";
import presetTailwindForms from "@twind/preset-tailwind-forms";
import presetTypography from "@twind/preset-typography";

export default defineConfig({
  presets: [
    presetAutoprefix(),
    presetContainerQueries(),
    presetExt(),
    presetLineClamp(),
    presetRadixUi(),
    presetTailwind(),
    presetTailwindForms(),
    presetTypography(),
  ],
});
