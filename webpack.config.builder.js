const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// const devMode = process.env.NODE_ENV !== "production";

const rel = string => string.replace(/^\/+/, "");

module.exports = function(options) {
  const entries = options.entries || {};
  const optionPublicPathHot = options.publicPathHot || "http://localhost:8080/";
  const optionPublicPath = options.publicPath || undefined;
  const optionStaticPath = options.staticPath || "static";
  const optionDistPath = options.distPath || "dist";
  const optionSrcPath = options.srcPath || "src";
  const optionHtmlFiles = options.htmlFiles || [];
  const resDirImages = options.resDirImages || "";
  const resDirFonts = options.resDirFonts || "";
  const resDirCss = options.resDirCss || "";
  const resDirJs = options.resDirJs || "";

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

    const suffix = isHot ? "" : "?ver=[chunkhash]";

    const MiniCssExtractPluginLoaderOptions = {
      hmr: isHot,
      reloadAll: true,
      publicPath: resDirCss
        .trim("/")
        .split("/")
        .map(_ => "..")
        .join("/")
    };

    console.log("mode", mode);
    console.log("watch", isWatch);
    console.log("hot", isHot);

    return {
      context: path.resolve(__dirname, optionSrcPath),
      stats: {
        children: false,
        entrypoints: false,
        excludeAssets: /\.(gif|png|jpg|jpeg|svg)/
      },
      node: {
        __filename: true, // fix __filename variable in js
        __dirname: true // fix __dirname variable in js
      },
      watch: isWatch && !isHot,
      watchOptions: {
        ignored: /node_modules/
      },
      devServer: {
        contentBase: path.resolve(__dirname, optionDistPath),
        watchContentBase: !isHot && !isProd,
        disableHostCheck: true,
        progress: false,
        compress: true,
        headers: {
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization",
          "Access-Control-Allow-Origin": "*"
        }
      },
      entry: entries,
      output: {
        publicPath,
        path: path.resolve(__dirname, optionDistPath),
        filename: rel(`${resDirJs}/[name].js` + suffix),
        chunkFilename: rel(`${resDirJs}/[name].js` + suffix)
      },
      resolve: {
        extensions: [".js", ".jsx", ".vue", ".json"],
        alias: {
          static: path.resolve(__dirname, optionStaticPath),
          vue$: "vue/dist/vue.esm.js"
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
            loader: "babel-loader"
          },
          {
            test: /\.vue$/,
            loader: "vue-loader"
          },
          {
            test: /\.module\.(sa|sc|c)ss$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: MiniCssExtractPluginLoaderOptions
              },
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  importLoaders: 3
                }
              },
              "postcss-loader",
              "resolve-url-loader",
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          },
          {
            test: /\.(sa|sc|c)ss$/,
            exclude: /\.module.(sa|sc|c)ss$/,
            oneOf: [
              {
                resourceQuery: /module/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: MiniCssExtractPluginLoaderOptions
                  },
                  {
                    loader: "css-loader",
                    options: {
                      modules: true,
                      importLoaders: 3
                    }
                  },
                  "postcss-loader",
                  "resolve-url-loader",
                  {
                    loader: "sass-loader",
                    options: {
                      sourceMap: true
                    }
                  }
                ]
              },
              {
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      hmr: isHot,
                      reloadAll: true,
                      publicPath: resDirCss
                        .trim("/")
                        .split("/")
                        .map(_ => "..")
                        .join("/")
                    }
                  },
                  "css-loader",
                  "postcss-loader",
                  "resolve-url-loader",
                  {
                    loader: "sass-loader",
                    options: {
                      sourceMap: true
                    }
                  }
                ]
              }
            ]
          },
          {
            test: /\.(?:ttf|eot|woff2?)(?:\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: "file-loader",
              options: {
                name: "[name].[hash].[ext]",
                outputPath: resDirFonts,
                useRelativePath: true
              }
            }
          },
          {
            test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
            use: {
              loader: "file-loader",
              options: {
                name: `[name].[hash].[ext]`,
                outputPath: resDirImages,
                useRelativePath: true
              }
            }
          }
        ]
      },
      performance: {
        hints: false
      },
      optimization: {
        namedModules: true,
        namedChunks: true,
        moduleIds: "hashed",
        chunkIds: "named",
        runtimeChunk: {
          name: "runtime"
        },
        splitChunks: {
          maxInitialRequests: Infinity,
          automaticNameMaxLength: 16,
          minSize: 30000,
          chunks: "all"
        }
      },
      plugins: [
        new FriendlyErrorsWebpackPlugin(),
        !isProd ? null : new CleanWebpackPlugin(),
        new WriteFilePlugin(),
        new WebpackAssetsManifest({
          output: "assets.json",
          entrypointsKey: "entrypoints",
          entrypoints: true,
          publicPath: true,
          transform: (assets, manifest) => ({
            entries: assets.entrypoints
          })
        }),
        new MiniCssExtractPlugin({
          filename: rel(`${resDirCss}/[name].css` + suffix),
          chunkFilename: rel(`${resDirCss}/[name].css` + suffix)
        }),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, optionStaticPath),
            to: path.resolve(__dirname, optionDistPath)
          }
        ]),
        ...htmlFiles,
        !isProd
          ? null
          : new BundleAnalyzerPlugin({
              reportFilename: "bundle.htm",
              analyzerMode: "static",
              openAnalyzer: false
            })
      ].filter(plugin => !!plugin)
    };
  };
};
