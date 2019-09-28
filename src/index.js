import "./scss/index.scss";
import React from "react";

const qsa = selector => [...document.querySelectorAll(selector)];

qsa(".root-jquery").forEach(async root => {
  const $ = (await import("jquery")).default;
  $(root).html("Jquery works");
});

qsa(".root-react").forEach(async root => {
  const ReactDOM = (await import("react-dom")).default;
  const ReactApp = (await import("./components/App.js")).default;
  ReactDOM.render(<ReactApp />, root);
});

qsa(".root-vue").forEach(async root => {
  const Vue = (await import("vue")).default;
  Vue.config.productionTip = false;

  const VueApp = (await import("./components/App.vue")).default;

  new Vue({
    el: root,
    components: { VueApp },
    template: `<section class="bordered-section"><VueApp /></section>`
  });
});

module && module.hot && module.hot.accept();
