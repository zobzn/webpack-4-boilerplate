const glob = require("glob");
const path = require("path");
const builder = require("./webpack.config.builder");

const entries = glob.sync("./src/index.js").reduce((entries, filepath) => {
  const chunk = filepath.replace(/^\.\/src\//, "./");
  const entryName = filepath
    .split("/")
    .pop()
    .replace(/\.js$/i, "");

  return { ...entries, [entryName]: chunk };
}, {});

const htmls = glob.sync("./src/*.{htm,html}").reduce(
  (htmls, filepath) => [
    ...htmls,
    {
      template: path.resolve(__dirname, filepath),
      filename: filepath.split("/").pop(),
      xhtml: true
    }
  ],
  []
);

module.exports = builder({
  publicPathHot: "http://localhost:8080/",
  publicPath: "", // '/' or './' or '//cdn.example.org/' or whatever
  resDirImages: "assets/img",
  resDirFonts: "assets/fonts",
  resDirCss: "assets/css",
  resDirJs: "assets/js",
  htmlFiles: htmls,
  entries
});
