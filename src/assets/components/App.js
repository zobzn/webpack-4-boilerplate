import React, { useState } from "react";
import useInterval from "../hooks/useInterval";

console.log(`${__filename.replace("\\", "/")} - запуск`);

function Counter() {
  const [i, setI] = useState(1);

  useInterval(() => {
    setI(i + 1);
  }, 100);

  return <div>react {i} ;)</div>;
}

function App() {
  return (
    <div>
      <section className="bordered-section">
        <h3>React</h3>
        <Counter />
      </section>
      <section className="bordered-section">
        <h3>Images in sass</h3>
        <div className="image-webpack"></div>
      </section>
      <section className="bordered-section">
        <h3>FontAwesome</h3>
        <div>
          <i className="fab fa-php fa-2x"></i>{" "}
          <i className="fab fa-node-js fa-2x"></i>
          <i className="fas fa-star fa-2x"></i>
          <i className="far fa-star fa-2x"></i>
        </div>
      </section>
    </div>
  );
}

export default App;

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
