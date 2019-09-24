import React, { useState } from "react";
import useInterval from "../hooks/useInterval";

function Counter() {
  const [i, setI] = useState(1);

  useInterval(() => {
    setI(i + 1);
  }, 100);

  return <>{i} ;)</>;
}

function App() {
  return (
    <>
      <section className="bordered-section">
        <div>React works</div>
        <Counter />
      </section>
    </>
  );
}

export default App;
