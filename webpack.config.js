const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

let HWPConfig = new HtmlWebpackPlugin({
  template: __dirname + "/index.html",
  file: "index.html",
  inject: "body"
});

module.exports = {
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  entry: {
    first: ["./src/first.js"],
    second: ["./src/second.js"]
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development"
            }
          },
          // "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new ManifestPlugin(),
    new HtmlWebpackPlugin({
      // template: __dirname + `/src/first.htm`,
      filename: "first.htm",
      chunks: ["first"]
    }),
    new HtmlWebpackPlugin({
      // template: __dirname + `/src/second.htm`,
      filename: "second.htm",
      chunks: ["second"]
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
      // ignoreOrder: false // Enable to remove warnings about conflicting order
    })
  ]
};
