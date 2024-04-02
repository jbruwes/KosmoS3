const $id = "urn:jsonschema:page";
const additionalProperties = false;
const nullable = true;
const type = "object";
const id = "uuid";
const dynamicDefaults = { id };
const children = { type: "array", default: [], items: { $ref: "#" } };
const properties = {
  id: { type: "string" },
  changefreq: { type: "string", nullable, default: null },
  description: { type: "string", nullable, default: null },
  icon: { type: "string", nullable, default: null },
  image: { type: "string", nullable, default: null },
  keywords: {
    type: "array",
    default: [],
    items: { type: "string" },
  },
  label: { type: "string", nullable, default: null },
  lastmod: { type: "string", nullable, default: null },
  loc: { type: "string", nullable, default: null },
  priority: { type: "number", nullable, default: null },
  template: { type: "string", default: "" },
  script: { type: "string", default: "" },
  style: { type: "string", default: "" },
  theme: { type: "string", nullable, default: null },
  title: { type: "string", nullable, default: null },
  visible: { type: "boolean", default: true },
  type: { type: "string", nullable, default: null },
  alt: { type: "string", nullable, default: null },
  full: { type: "boolean", default: true },
  setup: { type: "boolean", default: true },
  scoped: { type: "boolean", default: true },
} as const;

export const plainPage = {
  $id,
  type,
  properties,
  additionalProperties,
} as const;

export default {
  $id,
  dynamicDefaults,
  type,
  properties: { children, ...properties },
  additionalProperties,
} as const;
