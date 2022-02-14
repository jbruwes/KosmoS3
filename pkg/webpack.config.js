const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const babelSettings = {
  extends: path.join(__dirname, "../.babelrc.json"),
};
module.exports = {
  target: "electron-main",
  mode: "production",
  context: path.resolve(__dirname),
  entry: { main: "./main.js" },
  output: {
    path: path.join(__dirname, "../dist"),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: `babel-loader?${JSON.stringify(babelSettings)}`,
      },
    ],
  },
  stats: "minimal",
  resolve: {
    extensions: [".js"],
    modules: ["node_modules"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "../package.json" }],
    }),
  ],
  performance: { hints: false },
};
