module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  globals: {
    init: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:jsdoc/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue-pug/vue3-recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "jsdoc/require-jsdoc": [
      "error",
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ClassExpression: true,
          ArrowFunctionExpression: true,
          FunctionExpression: true,
        },
      },
    ],
  },
  plugins: ["jsdoc", "vue"],
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
      },
    },
    "import/core-modules": [
      "vuetify/styles",
      "vuetify/iconsets/fa",
      "vuetify/iconsets/mdi",
      "vuetify/components",
      "vuetify/directives",
    ],
  },
};
