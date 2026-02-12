import { useWorkoutStore } from "@/store/workoutStore";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTimer } from "react-timer-hook";

export enum StepType {
  PREPARE = "prepare",
  WORK = "work",
  REST = "rest",
}

export type Step = {
  type: string;
  duration: number;
  round?: number;
};

type Props = {
  steps: Step[];
  onFinish?: () => void;
};

export function useWorkoutTimer({ steps, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const currentStep = steps[index];
  const totalDuration = currentStep?.duration ?? 0;
  const setIsRunningGlobally = useWorkoutStore((s) => s.setIsRunning);

  const createExpiry = useCallback((duration: number) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + duration);
    return time;
  }, []);

  const handleExpire = useCallback(() => {
    if (currentStep.type !== StepType.PREPARE)
      setTotalElapsed((prev) => prev + totalDuration);

    setIndex((prev) => {
      const next = prev + 1;

      if (next >= steps.length) {
        onFinish?.();
        return prev;
      }

      const nextDuration = steps[next].duration;
      restart(createExpiry(nextDuration), true);

      return next;
    });
  }, [steps, onFinish]);

  const { seconds, minutes, hours, start, resume, pause, restart, isRunning } =
    useTimer({
      expiryTimestamp: createExpiry(totalDuration),
      autoStart: false,
      onExpire: handleExpire,
    });

  useEffect(() => {
    if (isRunning) {
      setIsRunningGlobally(true);
      activateKeepAwakeAsync("timer");
    } else {
      setIsRunningGlobally(false);
      deactivateKeepAwake("timer");
    }
  }, [isRunning]);

  const remaining = hours * 3600 + minutes * 60 + seconds;

  const progress = useMemo(() => {
    if (!totalDuration) return 0;
    return ((totalDuration - remaining) / totalDuration) * 100;
  }, [remaining, totalDuration]);

  const resetAll = useCallback(() => {
    pause();
    setIndex(0);
    restart(createExpiry(steps[0].duration), false);
    setTotalElapsed(0);
  }, [steps]);

  const finish = useCallback(() => {
    pause();
    const elapsedCurrent = totalDuration - remaining;
    setTotalElapsed((prev) => prev + elapsedCurrent);
    onFinish?.();
  }, [onFinish]);

  const handleStartResume = () => {
    if (!isRunning && remaining === 0)
      start(); // start do zero
    else if (!isRunning)
      resume(); // resume
    else pause(); // pausando
  };

  return {
    currentStep,
    progress,
    remainingMinutes: minutes,
    remainingSeconds: seconds,
    handleStartResume,
    pause,
    reset: resetAll,
    finish,
    isRunning,
    totalDuration,
    remaining,
    totalElapsed,
  };
}
