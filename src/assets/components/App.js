import React, { useState } from "react";
import useInterval from "../hooks/useInterval";

console.log(`${__filename.replace("\\", "/")} - запуск`);

export default function App() {
  const [i, setI] = useState(1);

  useInterval(() => {
    setI(i + 1);
  }, 100);

  return <div>react {i} ;)</div>;
}

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
