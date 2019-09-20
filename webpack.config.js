const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const devMode = process.env.NODE_ENV !== "production";

module.exports = function(env, argv) {
  console.log(env, argv);

  return {
    watch: !!devMode,
    watchOptions: {
      ignored: /node_modules/
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      // port: 9000,
      watchContentBase: true,
      progress: true
      // hot: true
    },
    entry: {
      first: ["./src/first.js"],
      second: ["./src/second.js"]
    },
    output: {
      // filename: "[name].[chunkhash:8].min.js",
      filename: "[name].[chunkhash].min.js",
      path: path.resolve(__dirname, "dist")
    },
    module: {
      rules: [
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
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !!devMode
              }
            },
            // "style-loader",
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
              // name: '[path][name].[ext]',
              // context: 'src', // prevent display of src/ in filename
            }
          }
        }
      ]
    },
    optimization: {
      // runtimeChunk: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/, // you may add "vendor.js" here if you want to
            name: "vendors",
            chunks: "initial",
            enforce: true
          }
        }
      }
    },
    plugins: [
      // new ManifestPlugin(),
      new WebpackAssetsManifest({
        entrypoints: true
        // if you need entrypoints only
        // transform: assets => assets.entrypoints
      }),
      new HtmlWebpackPlugin({
        // inject: "body"
        template: __dirname + `/src/first.htm`,
        filename: "first.htm",
        chunks: ["vendors", "first"],
        title: "Документ 1"
      }),
      new HtmlWebpackPlugin({
        // inject: "body"
        template: __dirname + `/src/second.htm`,
        filename: "second.htm",
        chunks: ["vendors", "second"],
        title: "Документ 2"
      }),
      new MiniCssExtractPlugin({
        filename: false && devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: false && devMode ? "[id].css" : "[id].[hash].css"
        // ignoreOrder: false // Enable to remove warnings about conflicting order
      }),
      new webpack.HashedModuleIdsPlugin({
        // hashFunction: "sha256",
        // hashDigest: "hex",
        // hashDigestLength: 20
        // ------
        // hashFunction: "md4",
        // hashDigest: "base64",
        // hashDigestLength: 4
      })
    ]
  };
};
