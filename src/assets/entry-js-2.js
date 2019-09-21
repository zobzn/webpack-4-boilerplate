import logger1 from "./logger-1";
import $ from "jquery";
import "./scss/second.scss";

console.log(`${__filename.replace("\\", "/")} - запуск`);

logger1(2);

$("body").append("it works 2");

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
