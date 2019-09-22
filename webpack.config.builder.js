const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

// const devMode = process.env.NODE_ENV !== "production";

module.exports = function(options) {
  const entries = options.entries || {};
  const optionPublicPathHot = options.publicPathHot || "http://localhost:8080/";
  const optionPublicPath = options.publicPath || undefined;
  const optionHtmlFiles = options.htmlFiles || [];
  const htmlFiles = optionHtmlFiles.map(opts => new HtmlWebpackPlugin(opts));

  return function(env, argv) {
    const mode = argv.mode || undefined;
    const isProd = mode === "production";
    const isDev = mode === "development";
    const isWatch = !!argv.watch;
    const isHot = !!argv.hot;

    const publicPath = isHot
      ? optionPublicPathHot || optionPublicPath
      : optionPublicPath;

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
      ...htmlFiles,
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[chunkhash].css",
        chunkFilename: "assets/css/[name].[chunkhash].css"
      }),
      new VueLoaderPlugin()
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
      entry: entries,
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
      resolve: {
        extensions: [".js", ".jsx", ".vue", ".json"],
        alias: {
          static: path.resolve(__dirname, "static")
        }
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
            test: /\.vue$/,
            use: {
              loader: "vue-loader"
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
};
