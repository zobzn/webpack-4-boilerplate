const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { HashedModuleIdsPlugin } = webpack;
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

// const devMode = process.env.NODE_ENV !== "production";

module.exports = function(env, argv) {
  const mode = argv.mode || undefined;
  const isProd = mode === "production";
  const isDev = mode === "development";
  const isWatch = !!argv.watch;
  const isHot = !!argv.hot;

  // '/' or './' or '//cdn.example.org/' or whatever
  const publicPath = isHot ? "http://localhost:8080/" : undefined;

  console.log("mode", mode);
  console.log("watch", isWatch);
  console.log("hot", isHot);

  const plugins = [
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin(),
    new WriteFilePlugin(),
    new ManifestPlugin({
      fileName: "manifest.json"
    }),
    new WebpackAssetsManifest({
      entrypoints: true,
      output: "assets-manifest.json",
      publicPath: true, // "/", "//cdn.example.org/"
      transform: (assets, manifest) => {
        const { name, version } = require("./package.json");

        return {
          package: { name, version },
          entries: assets.entrypoints
        };
      }
    }),
    new HtmlWebpackPlugin({
      // inject: "body"
      xhtml: true,
      title: "Документ 1",
      template: path.resolve(__dirname, "src/index-1.htm"),
      filename: "index-1.htm"
      // chunks: ["vendors", "entry-js-1"]
    }),
    new HtmlWebpackPlugin({
      // inject: "body"
      xhtml: true,
      title: "Документ 2",
      template: path.resolve(__dirname, "src/index-2.htm"),
      filename: "index-2.htm"
      // chunks: ["vendors", "entry-js-2"]
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[chunkhash].css",
      chunkFilename: "assets/css/[chunkhash].css"
    }),
    new HashedModuleIdsPlugin()
  ];

  if (isProd) {
    plugins.push(
      new BundleAnalyzerPlugin({
        reportFilename: "bundle.html",
        analyzerMode: "static",
        openAnalyzer: false
      })
    );
  }

  return {
    context: path.resolve(__dirname, "src"),
    node: {
      __filename: true,
      __dirname: true
    },
    watch: isWatch,
    watchOptions: {
      ignored: /node_modules/
    },
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      compress: true,
      // port: 9000,
      watchContentBase: true,
      progress: false
      // hot: true
    },
    entry: {
      "entry-js-1": "./assets/entry-js-1.js",
      "entry-js-2": "./assets/entry-js-2.js"
    },
    output: {
      publicPath,
      filename: isHot
        ? "assets/js/[name].js"
        : "assets/js/[name].[chunkhash].js",
      chunkFilename: isHot
        ? "assets/js/[name].js"
        : "assets/js/[name].[chunkhash].js",
      path: path.resolve(__dirname, "dist")
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]"
              }
            },
            "extract-loader",
            "html-loader"
          ]
        },
        {
          test: /\.m?jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            false
              ? "style-loader"
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    // only enable hot in development
                    hmr: isHot,
                    // if hmr does not work, this is a forceful method.
                    reloadAll: true
                  }
                },
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
          use: {
            loader: "file-loader",
            options: {
              name: "assets/img/[hash].[ext]"
            }
          }
        }
      ]
    },
    performance: {
      hints: false
    },
    optimization: {
      moduleIds: "hashed",
      runtimeChunk: {
        name: "runtime"
      },
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            // name: "vendors",
            chunks: "all",
            name: false
          }
          // vendor: {
          //   test: /node_modules/,
          //   name: "vendors",
          //   chunks: "initial",
          //   enforce: true
          // }
        }
      }
    },
    plugins
  };
};
