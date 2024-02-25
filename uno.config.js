import presetAttributify from "@unocss/preset-attributify";
import presetTagify from "@unocss/preset-tagify";
import presetTypography from "@unocss/preset-typography";
import presetUno from "@unocss/preset-uno";
import presetWebFonts from "@unocss/preset-web-fonts";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

import fontArray from "./src/assets/fonts.json";

export const fonts = Object.fromEntries(
  fontArray.map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
);

export default {
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetTagify(),
    presetWebFonts({ fonts }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
};
