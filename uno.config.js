import presetAttributify from "@unocss/preset-attributify";
import presetTagify from "@unocss/preset-tagify";
import presetTypography from "@unocss/preset-typography";
import presetUno from "@unocss/preset-uno";
import presetWebFonts from "@unocss/preset-web-fonts";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export const fonts = Object.fromEntries(
  [
    "Arsenal",
    "Bad Script",
    "Caveat",
    "Comfortaa",
    "Cormorant Garamond",
    "Cormorant Infant",
    "Cormorant SC",
    "Cormorant Unicase",
    "Cormorant",
    "Jura",
    "Marck Script",
    "Montserrat",
    "Montserrat Alternates",
    "Open Sans Condensed",
    "Open Sans",
    "Oswald",
    "Pattaya",
    "Poiret One",
    "Roboto Condensed",
    "Roboto Mono",
    "Roboto Slab",
    "Roboto",
    "Rubik Mono One",
    "Rubik",
    "Tenor Sans",
  ].map((value) => [value.toLowerCase().replaceAll(" ", "_"), value]),
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
