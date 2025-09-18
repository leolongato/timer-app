import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect, useMemo, useState } from "react";

export enum StepType {
  PREPARE = "prepare",
  WORK = "work",
  REST = "rest",
}

export type Step = { type: StepType; duration: number };
export type Round = { repeat: number; steps: Step[] };

export function useTimer(rounds: Round[], prepare: number = 10) {
  const { sequence, stepToRound, totalRounds } = useMemo(() => {
    const seq: Step[] = [];
    const map: number[] = [];

    seq.push({ type: StepType.PREPARE, duration: prepare });
    map.push(0);

    let roundNum = 1;
    for (const r of rounds) {
      for (let rep = 0; rep < r.repeat; rep++) {
        for (const s of r.steps) {
          seq.push(s);
          map.push(roundNum);
        }
        roundNum++;
      }
    }

    return {
      sequence: seq,
      stepToRound: map,
      totalRounds: Math.max(0, roundNum - 1),
    };
  }, [rounds, prepare]);

  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(sequence[0]?.duration ?? 0);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const elapsedMinutes = Math.floor(elapsed / 60);
  const elapsedSeconds = Math.floor(elapsed % 60);

  const remainingMinutes = Math.floor(remaining / 60);
  const remainingSeconds = Math.floor(remaining % 60);

  useEffect(() => {
    if (isRunning) {
      activateKeepAwakeAsync("timer");
    } else {
      deactivateKeepAwake("timer");
    }
  }, [isRunning]);

  useEffect(() => {
    if (remaining === 0 && stepIndex + 1 === sequence.length) {
      setShowPopup(true);
    }
  }, [remaining, stepIndex, sequence]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 0) {
          if (sequence[stepIndex].type !== StepType.PREPARE) {
            setElapsed((e) => e + 1);
          }

          return prev - 1;
        } else {
          const nextIndex = stepIndex + 1;
          if (nextIndex < sequence.length) {
            setStepIndex(nextIndex);
            return sequence[nextIndex].duration;
          }
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, stepIndex, sequence]);

  const progress = useMemo(() => {
    const curStep = sequence[stepIndex];
    if (!curStep) return 0;
    if (curStep.duration === 0) return 0;
    return ((curStep.duration - remaining) / curStep.duration) * 100;
  }, [remaining, stepIndex, sequence]);

  const start = () => {
    if (!isRunning && sequence.length > 0) {
      setIsRunning(true);
    }
  };

  const stop = () => {
    if (isRunning) setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setStepIndex(0);
    setRemaining(sequence[0]?.duration ?? 0);
    setElapsed(0);
    setShowPopup(false);
  };

  const currentStep =
    sequence[stepIndex].duration > 0 ? sequence[stepIndex] : sequence[0];
  const currentRound = stepToRound[stepIndex] ?? 0;

  return {
    currentStep,
    stepIndex,
    remaining,
    elapsed,
    elapsedMinutes,
    elapsedSeconds,
    isRunning,
    showPopup,
    setShowPopup,
    currentRound,
    totalRounds,
    start,
    stop,
    reset,
    progress,
    remainingMinutes,
    remainingSeconds,
  };
}
