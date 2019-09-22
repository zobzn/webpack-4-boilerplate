import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import App from "./components/App";

console.log(`${__filename.replace("\\", "/")} - запуск 2`);

(async () => {
  let element = document.querySelector(".root-logger-1");
  if (element) {
    const createLogger = (await import("./logger-1")).default;
    const log = createLogger(element);

    log("from imported module");
  }
})();

(() => {
  const root = $(".root-jquery");
  const output = $($.parseHTML("<section />"))
    .addClass("bordered-section")
    .append($.parseHTML("<h3>jQuery</h3>"))
    .appendTo(root);

  output.append($.parseHTML("<div>2 jquery works</div>"));
})();

const root = document.querySelector(".root-react");
if (root) {
  ReactDOM.render(<App />, root);
}

if (module && module.hot) {
  // module.hot.accept();
  module.hot.decline();
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
