import React from "react";
import ReactDOM from "react-dom";
import Vue from "vue";
import $ from "jquery";
import ReactApp from "./components/App.js";
import VueApp from "./components/App.vue";

(() => {
  const root = $(".root-jquery");
  root.html("Jquery works");
})();

(() => {
  const root = document.querySelector(".root-react");
  root && ReactDOM.render(<ReactApp />, root);
})();

(() => {
  const root = document.querySelector(".root-vue");
  root &&
    new Vue({
      el: root,
      components: { VueApp },
      template: `<section class="bordered-section"><VueApp /></section>`
    });
})();

if (module && module.hot) {
  // module.hot.accept();
  module.hot.decline();
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
