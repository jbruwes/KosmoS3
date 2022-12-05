const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const pack = require("../package.json");

const babelSettings = {
  extends: path.join(__dirname, "../.babelrc.json"),
};

module.exports = {
  mode: "production",
  context: path.resolve(__dirname),
  entry: { kosmos3: "./sources/kosmos3.js" },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[contenthash].js",
    assetModuleFilename: "[contenthash][ext]",
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

      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          /**
           * Возвращает название модуля для чанка
           *
           * @param {object} module Модуль
           * @returns {string} Название модуля
           */
          name(module) {
            return `${module
              .identifier()
              .split("!")
              .pop()
              .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              .replace("@", "")}`;
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: `babel-loader?${JSON.stringify(babelSettings)}`,
      },
      {
        test: /content\.css$/i,
        use: ["css-loader"],
      },
      {
        test: /\.css$/i,
        exclude: /content\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset",
      },
    ],
  },
  stats: "minimal",
  resolve: {
    extensions: [".js"],
    modules: ["./sources", "node_modules"],
    alias: {
      "jet-views": path.resolve(__dirname, "sources/views"),
      "jet-locales": path.resolve(__dirname, "sources/locales"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "KosmoS3",
    }),
    new FaviconsWebpackPlugin({
      logo: "./resource/rocket.svg",
      mode: "webapp",
      devMode: "webapp",
      prefix: "",
    }),
    new MiniCssExtractPlugin({
      filename: "[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./resource/error.html" },
        { from: "./resource/CNAME" },
        { from: "./resource/rocket.svg" },
      ],
    }),
    new webpack.DefinePlugin({
      VERSION: `"${pack.version}"`,
      APPNAME: `"${pack.name}"`,
      PRODUCTION: true,
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "../dist"),
    },
    compress: true,
    server: "http",
    historyApiFallback: true,
  },
  performance: { hints: false },
};
