const $id = "urn:jsonschema:data";
const additionalProperties = false;
const type = "object";
const nullable = true;
const content = {
  type: "array",
  default: [{}],
  items: { $ref: "urn:jsonschema:page" },
  minItems: 1,
};
const properties = {
  settings: {
    type: "object",
    nullable,
    $ref: "urn:jsonschema:settings",
    default: {},
  },
  style: { nullable, type: "string", default: "" },
  script: { nullable, type: "string", default: "" },
  css: {
    nullable,
    type: "array",
    default: [{}],
    items: { $ref: "urn:jsonschema:resource" },
    minItems: 1,
  },
  js: {
    nullable,
    type: "array",
    default: [{}],
    items: { $ref: "urn:jsonschema:resource" },
    minItems: 1,
  },
  navbar: {
    type: "object",
    nullable,
    $ref: "urn:jsonschema:navbar",
    default: {},
  },
} as const;

export const plainData = {
  $id,
  type,
  properties,
  additionalProperties,
} as const;

export default {
  $id,
  type,
  properties: { content, ...properties },
  additionalProperties,
} as const;
