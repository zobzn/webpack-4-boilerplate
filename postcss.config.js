module.exports = {
  plugins: {
    "postcss-preset-env": {},
    "postcss-url": {
      url: asset => {
        if (asset.url[0] === "/") {
          return `~static${asset.url}`;
        }
        return asset.url;
      }
    }
  }
};
