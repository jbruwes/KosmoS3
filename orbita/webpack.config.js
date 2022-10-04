const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { VueLoaderPlugin } = require("vue-loader");

const babelSettings = {
  extends: path.join(__dirname, "../babel.config.js"),
};
module.exports = {
  mode: "production",
  context: path.resolve(__dirname),
  entry: { fel: "./sources/index.js" },
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
          name: (module) =>
            `${module
              .identifier()
              .split("!")
              .pop()
              .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              .replace("@", "")}`,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: "vue-loader",
        options: {
          esModule: true,
        },
      },
      {
        test: /\.js$/i,
        use: `babel-loader?${JSON.stringify(babelSettings)}`,
      },
      {
        test: /\.css$/i,
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
    extensions: [".js", ".vue", ".json"],
    modules: ["./sources", "node_modules"],
    alias: {
      vue$: "vue/dist/vue.esm-bundler.js",
      "@": path.join(__dirname, "./sources"),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      filename: "index.htm",
      template: "./resource/index.htm",
    }),
    new WebpackAssetsManifest({
      /**
       * Сортировка строк в манифесте по расширениям файлов
       *
       * @param {string} a Первый файл
       * @param {string} b Второй файл
       * @returns {number} Возвращает -1, 0, или 1
       */
      sortManifest(a, b) {
        const extA = this.getExtension(a);
        const extB = this.getExtension(b);
        if (extA > extB) return 1;
        if (extA < extB) return -1;
        return a.localeCompare(b);
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./resource/error.html" },
        { from: "./resource/robots.txt" },
        { from: "./resource/site.webmanifest" },
        { from: "./resource/browserconfig.xml" },
        { from: "./resource/noise.png" },
      ],
    }),
  ],
  performance: { hints: false },
};
