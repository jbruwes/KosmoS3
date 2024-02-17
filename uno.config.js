import presetAttributify from "@unocss/preset-attributify";
import presetTagify from "@unocss/preset-tagify";
import presetTypography from "@unocss/preset-typography";
import presetUno from "@unocss/preset-uno";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default {
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetTagify(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
};
