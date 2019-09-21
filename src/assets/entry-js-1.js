import "./first.scss";
import "./first-inner";

console.log(`${__filename.replace("\\", "/")} - запуск`);
console.log(`${__filename.replace("\\", "/")} - запуск 321`);

if (module && module.hot) {
  module.hot.accept();
  // module.hot.decline();
}

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
