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
      <div>
        <Counter />
      </div>
      <div>
        <div className="image-webpack"></div>
      </div>
    </div>
  );
}

export default App;

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
