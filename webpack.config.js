const glob = require("glob");
const path = require("path");
const builder = require("./webpack.config.builder");

const entries = glob
  .sync("./src/assets/entry-*.js")
  .reduce(function(entries, file) {
    const key = file
      .split("/")
      .pop()
      .replace(/\.js$/i, "");
    val = file.replace(/^\.\/src\//, "./");

    return { ...entries, [key]: val };
  }, {});

// console.log(entries);

module.exports = builder({
  publicPathHot: "http://localhost:8080/",
  publicPath: "", // '/' or './' or '//cdn.example.org/' or whatever
  entries,
  htmlFiles: [
    {
      // inject: "body"
      xhtml: true,
      title: "Документ 1",
      template: path.resolve(__dirname, "src/index-1.htm"),
      filename: "index-1.htm"
      // chunks: ["vendors", "entry-js-1"]
    },
    {
      // inject: "body"
      xhtml: true,
      title: "Документ 2",
      template: path.resolve(__dirname, "src/index-2.htm"),
      filename: "index-2.htm"
      // chunks: ["vendors", "entry-js-2"]
    }
  ]
});
