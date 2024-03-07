require("@rushstack/eslint-patch/modern-module-resolution");

const path = require("node:path");
const createAliasSetting = require("@vue/eslint-config-airbnb/createAliasSetting");

module.exports = {
  settings: {
    ...createAliasSetting({
      "@": `${path.resolve(__dirname, "./src")}`,
    }),
  },
};
