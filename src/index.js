import "./index.scss";

(async () => {
  await import("./inner.js");
})();

if (module && module.hot) {
  module.hot.accept();
  // module.hot.decline();
}

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
