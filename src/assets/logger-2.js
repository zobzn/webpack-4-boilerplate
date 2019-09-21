console.log(`${__filename.replace("\\", "/")} - запуск`);

const out =
  document.querySelector(".root-logger-2") ||
  document.body.appendChild(document.createElement("div"));

out.innerHTML = null;

export default (...args) => {
  const txt = document.createTextNode(JSON.stringify(["logger 2", ...args]));
  const div = document.createElement("div");
  div.appendChild(txt);
  out.appendChild(div);
};

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
