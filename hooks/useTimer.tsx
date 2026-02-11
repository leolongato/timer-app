import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export enum StepType {
  PREPARE = "prepare",
  WORK = "work",
  REST = "rest",
}

export type Step = { type: StepType; duration: number };
export type Round = { repeat: number; steps: Step[] };

export function useTimer(rounds: Round[], prepare: number = 10) {
  // ===============================
  // 1. SEQUENCE
  // ===============================
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

  // ===============================
  // 2. STATE
  // ===============================
  const [stepIndex, setStepIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(
    (sequence[0]?.duration ?? 0) * 1000,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ===============================
  // 3. REFS
  // ===============================
  const stepStartRef = useRef(0);
  const workStartRef = useRef(0);
  const pausedAccumulatedRef = useRef(0);
  const pauseStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const stepIndexRef = useRef(stepIndex);
  const remainingMsRef = useRef(remainingMs);
  const sequenceRef = useRef(sequence);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  // ===============================
  // 4. KEEP AWAKE
  // ===============================
  useEffect(() => {
    if (isRunning) activateKeepAwakeAsync("timer");
    else deactivateKeepAwake("timer");

    deactivateKeepAwake("timer");
  }, [isRunning]);

  // ===============================
  // 5. MAIN TIMER LOOP
  // ===============================
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      const now = performance.now();
      const currentStep = sequenceRef.current[stepIndexRef.current];

      if (!currentStep) {
        setIsRunning(false);
        return;
      }

      const durationMs = currentStep.duration * 1000;
      const elapsedInStep = now - stepStartRef.current;
      const expectedRemaining = durationMs - elapsedInStep;

      if (expectedRemaining > 0) {
        setRemainingMs(Math.max(expectedRemaining, 0));
      } else {
        const nextIndex = stepIndexRef.current + 1;

        if (nextIndex < sequenceRef.current.length) {
          const nextStep = sequenceRef.current[nextIndex];

          // Detect PREPARE -> WORK
          if (
            currentStep.type === StepType.PREPARE &&
            nextStep.type === StepType.WORK &&
            workStartRef.current === 0
          ) {
            workStartRef.current = performance.now();
          }

          setStepIndex(nextIndex);
          setRemainingMs(nextStep.duration * 1000);
          stepStartRef.current = performance.now();
        } else {
          setRemainingMs(0);
          setIsRunning(false);
          setShowPopup(true);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  // ===============================
  // 6. CONTROLS
  // ===============================
  const start = useCallback(() => {
    if (!isRunning && sequence.length > 0) {
      const now = performance.now();

      if (pauseStartRef.current > 0) {
        pausedAccumulatedRef.current += now - pauseStartRef.current;
        pauseStartRef.current = 0;
      }

      const currentStep = sequenceRef.current[stepIndexRef.current];
      const durationMs = currentStep.duration * 1000;

      // 🔒 clamp seguro
      const safeRemaining = Math.min(
        Math.max(remainingMsRef.current, 0),
        durationMs,
      );

      const alreadyElapsed = durationMs - safeRemaining;

      stepStartRef.current = now - alreadyElapsed;

      setIsRunning(true);
    }
  }, [isRunning, sequence.length]);

  const stop = useCallback(() => {
    if (isRunning) {
      pauseStartRef.current = performance.now();
      setIsRunning(false);
    }
  }, [isRunning]);

  const finish = useCallback(() => {
    const now = performance.now();

    if (pauseStartRef.current > 0) {
      pausedAccumulatedRef.current += now - pauseStartRef.current;
      pauseStartRef.current = 0;
    }

    setIsRunning(false);
    setShowPopup(true);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setStepIndex(0);
    setRemainingMs((sequence[0]?.duration ?? 0) * 1000);
    setShowPopup(false);

    pausedAccumulatedRef.current = 0;
    pauseStartRef.current = 0;
    stepStartRef.current = 0;
    workStartRef.current = 0;
  }, [sequence]);

  // ===============================
  // 7. DERIVED VALUES
  // ===============================
  const remaining = Math.ceil(remainingMs / 1000);

  const totalElapsed =
    workStartRef.current === 0
      ? 0
      : Math.floor(
          (performance.now() -
            workStartRef.current -
            pausedAccumulatedRef.current) /
            1000,
        );

  const remainingMinutes = Math.floor(remaining / 60);
  const remainingSeconds = remaining % 60;

  const totalMinutes = Math.floor(totalElapsed / 60);
  const totalSeconds = totalElapsed % 60;

  const currentStep = sequence[stepIndex];
  const currentRound = stepToRound[stepIndex] ?? 0;

  const progress =
    currentStep?.duration > 0
      ? ((currentStep.duration * 1000 - remainingMs) /
          (currentStep.duration * 1000)) *
        100
      : 0;

  return {
    currentStep,
    stepIndex,
    remaining,
    remainingMinutes,
    remainingSeconds,
    totalElapsed,
    totalMinutes,
    totalSeconds,
    isRunning,
    showPopup,
    setShowPopup,
    currentRound,
    totalRounds,
    start,
    finish,
    stop,
    reset,
    progress,
  };
}
