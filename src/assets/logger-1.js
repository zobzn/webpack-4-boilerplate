console.log(`${__filename.replace("\\", "/")} - запуск 123`);

// ыыы
export default out => (...args) => {
  const txt = document.createTextNode(JSON.stringify(["logger 1", ...args]));
  const div = document.createElement("div");
  div.appendChild(txt);
  out.appendChild(div);
};

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
