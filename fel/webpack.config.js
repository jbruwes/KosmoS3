const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const babelSettings = {
  extends: path.join(__dirname, "../.babelrc.json"),
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
      // For webpack@5 you can use the `...` syntax to extend existing minimizers
      // '...',
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
           * @param module
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
    extensions: [".js"],
    modules: ["./sources", "node_modules"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.htm",
      template: "./resource/index.htm",
    }),
    new WebpackAssetsManifest(),
    new MiniCssExtractPlugin({
      filename: "[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./resource/404.html" },
        { from: "./resource/robots.txt" },
      ],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      jsel: "jsel",
      AOS: "aos",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "../dist"),
    },
    compress: true,
    // http2: true,
  },
  performance: { hints: false },
};
