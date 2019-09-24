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
const CopyWebpackPlugin = require("copy-webpack-plugin");

// const devMode = process.env.NODE_ENV !== "production";

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
      new MiniCssExtractPlugin({
        filename: `${resDirCss}/[name].[chunkhash].css`.replace(/^\/+/, ""),
        chunkFilename: `${resDirCss}/[name].[chunkhash].css`.replace(/^\/+/, "")
      }),
      new VueLoaderPlugin(),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, optionStaticPath),
          to: path.resolve(__dirname, optionDistPath)
        }
      ]),
      ...htmlFiles
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
      context: path.resolve(__dirname, optionSrcPath),
      node: {
        __filename: true,
        __dirname: true
      },
      watch: isWatch,
      watchOptions: {
        ignored: /node_modules/
      },
      devServer: {
        contentBase: path.resolve(__dirname, optionDistPath),
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
          ? `${resDirJs}/[name].js`.replace(/^\/+/, "")
          : `${resDirJs}/[name].[chunkhash].js`.replace(/^\/+/, ""),
        chunkFilename: isHot
          ? `${resDirJs}/[name].js`.replace(/^\/+/, "")
          : `${resDirJs}/[name].[chunkhash].js`.replace(/^\/+/, ""),
        path: path.resolve(__dirname, optionDistPath)
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
              "resolve-url-loader",
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                  // sourceMapContents: false
                }
              }
            ]
          },
          {
            test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: resDirFonts
              }
            }
          },
          {
            test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
            use: {
              loader: "file-loader",
              options: {
                name: `${resDirImages}/[hash].[ext]`.replace(/^\/+/, "")
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
          chunks: "all"
        }
      },
      plugins
    };
  };
};
