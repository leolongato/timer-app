import { useState } from "react";

const useForTime = () => {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number>(-1);

  const start = () => {
    const now = new Date().getTime();
    const countUpDate = 10 * 1000;

    const interval = setInterval(() => {
      const curTime = new Date().getTime();
      const distance = curTime - now;

      setIntervalId(interval);

      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));

      if (distance >= countUpDate) {
        clearInterval(interval);
        return;
      }
    }, 1000);
    setIntervalId(interval);
    setIsRunning(true);
  };

  const pause = () => {};

  const stop = () => {
    if (!isRunning) return;
    if (!intervalId) return;

    setIsRunning(false);
    clearInterval(intervalId);
  };

  return { minutes, seconds, start, stop };
};

export default useForTime;
