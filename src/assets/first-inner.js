import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import App from "./components/App";
import "./first.scss";

console.log(`${__filename.replace("\\", "/")} - запуск 2`);

const element = document.querySelector(".root-logger-1");
(async () => {
  const createLogger = (await import("./logger-1")).default;
  if (element) {
    const log = createLogger(element);

    log("1 from imported module");
    log("2 from imported module");
    log("3 from imported module");
  }
})();

(() => {
  let output = $(".root-jquery");

  if (!output.length) {
    output = $("<div />")
      .addClass("root-jquery")
      .appendTo(document.body);
  }

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
