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

/**
 * @param env
 */
module.exports = function exports(env) {
  const production = !!(env && env.production === "true");
  const standalone = !!(env && env.standalone === "true");
  const config = {
    mode: production ? "production" : "development",
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
          test: /content\.css$/i,
          use: ["css-loader"],
        },
        {
          test: /\.(less|css)$/i,
          exclude: /content\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
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
        title: "KosmoS3 CMS",
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
        PRODUCTION: production,
        BUILD_AS_MODULE: standalone,
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
  if (!production) {
    config.devtool = "eval-source-map";
  }

  return config;
};
