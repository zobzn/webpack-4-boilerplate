import "./scss/first.scss";
import "./first-inner.js";

console.log(`${__filename.replace("\\", "/")} - запуск`);

if (module && module.hot) {
  module.hot.accept();
  // module.hot.decline();
}

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
