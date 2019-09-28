import React, { useState } from "react";
import useInterval from "../hooks/useInterval";

import styles from "./App.module.scss";

function Counter() {
  const [i, setI] = useState(1);

  useInterval(() => {
    setI(i + 1);
  }, 100);

  return <div className={styles.counter}>{i}</div>;
}

function App() {
  return (
    <>
      <section className="bordered-section">
        <div className={styles.header}>React works</div>
        <Counter />
      </section>
    </>
  );
}

export default App;
