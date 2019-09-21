import { useEffect, useRef } from "react";

console.log(`${__filename.replace("\\", "/")} - запуск`);

const noop = () => {};

export default function useInterval(callback, delay = null, immediate = false) {
  const savedCallback = useRef(noop);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (!immediate) return;
    if (delay === null) return;
    savedCallback.current();
  }, [immediate]);

  useEffect(() => {
    if (delay === null) return undefined;
    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

if (module && module.hot) {
  module.hot.dispose(function() {
    console.log(`${__filename.replace("\\", "/")} - модуль будет заменен`);
  });
}
