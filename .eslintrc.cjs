module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
  },

  env: {
    node: true,
    browser: true,
    "vue/setup-compiler-macros": true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue-pug/vue3-recommended",
    "airbnb-base",
    "plugin:jsdoc/recommended",
    "plugin:sonarjs/recommended",
    "plugin:optimize-regex/recommended",
    "plugin:prettier/recommended",
  ],

  plugins: ["simple-import-sort"],

  globals: {
    ga: "readonly", // Google Analytics
    cordova: "readonly",
    __statics: "readonly",
    __QUASAR_SSR__: "readonly",
    __QUASAR_SSR_SERVER__: "readonly",
    __QUASAR_SSR_CLIENT__: "readonly",
    __QUASAR_SSR_PWA__: "readonly",
    process: "readonly",
    Capacitor: "readonly",
    chrome: "readonly",
  },

  // add your custom rules here
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
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

    // allow debugger during development only
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
      },
    },
  },
};
