import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

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
  // 3. REFS - Apenas timestamps
  // ===============================
  const rafRef = useRef<number | null>(null);
  const stepStartRef = useRef(0);
  const workStartRef = useRef(0);
  const pausedAccumulatedRef = useRef(0);
  const pauseStartRef = useRef(0);

  // ===============================
  // 4. KEEP AWAKE
  // ===============================
  useEffect(() => {
    function helper() {
      if (isRunning) {
        activateKeepAwakeAsync("timer");
      } else {
        deactivateKeepAwake("timer");
      }
      return deactivateKeepAwake("timer");
    }
    helper();
  }, [isRunning]);

  // ===============================
  // 5. BACKGROUND SUPPORT
  // ===============================
  useEffect(() => {
    let bgStart = 0;

    const sub = AppState.addEventListener("change", (state) => {
      if (!isRunning) return;

      if (state.match(/inactive|background/)) {
        bgStart = performance.now();
      } else if (state === "active" && bgStart > 0) {
        const bgTime = performance.now() - bgStart;
        stepStartRef.current += bgTime;
        if (workStartRef.current > 0) {
          workStartRef.current += bgTime;
        }
        bgStart = 0;
      }
    });

    return () => sub.remove();
  }, [isRunning]);

  // ===============================
  // 6. MAIN TIMER LOOP
  // ===============================
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = () => {
      const now = performance.now();
      const currentStep = sequence[stepIndex];

      if (!currentStep) {
        setIsRunning(false);
        setShowPopup(true);
        return;
      }

      const durationMs = currentStep.duration * 1000;
      const elapsedInStep = now - stepStartRef.current;
      const expectedRemaining = durationMs - elapsedInStep;

      if (expectedRemaining > 0) {
        setRemainingMs(Math.max(expectedRemaining, 0));
      } else {
        const nextIndex = stepIndex + 1;

        if (nextIndex < sequence.length) {
          const nextStep = sequence[nextIndex];

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

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isRunning, stepIndex, sequence]);

  // ===============================
  // 7. CONTROLS
  // ===============================
  const start = useCallback(() => {
    if (isRunning || sequence.length === 0) return;

    const now = performance.now();
    const currentStep = sequence[stepIndex];
    const durationMs = currentStep.duration * 1000;

    // Resume: acumula tempo de pausa (exceto no PREPARE)
    if (pauseStartRef.current > 0 && currentStep.type !== StepType.PREPARE) {
      pausedAccumulatedRef.current += now - pauseStartRef.current;
      pauseStartRef.current = 0;
    }

    // Ajusta stepStartRef baseado no remaining atual
    const safeRemaining = Math.min(Math.max(remainingMs, 0), durationMs);
    const alreadyElapsed = durationMs - safeRemaining;
    stepStartRef.current = now - alreadyElapsed;

    setIsRunning(true);
  }, [isRunning, sequence, stepIndex, remainingMs]);

  const stop = useCallback(() => {
    if (!isRunning) return;

    pauseStartRef.current = performance.now();
    setIsRunning(false);
  }, [isRunning]);

  const finish = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const now = performance.now();
    if (pauseStartRef.current > 0) {
      pausedAccumulatedRef.current += now - pauseStartRef.current;
      pauseStartRef.current = 0;
    }

    setIsRunning(false);
    setShowPopup(true);
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

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
  // 8. DERIVED VALUES
  // ===============================
  const currentStep = sequence[stepIndex];
  const currentRound = stepToRound[stepIndex] ?? 0;

  const remaining = Math.ceil(remainingMs / 1000);
  const remainingMinutes = Math.floor(remaining / 60);
  const remainingSeconds = remaining % 60;

  const totalElapsed =
    workStartRef.current === 0
      ? 0
      : Math.floor(
          (performance.now() -
            workStartRef.current -
            pausedAccumulatedRef.current) /
            1000,
        );
  const totalMinutes = Math.floor(totalElapsed / 60);
  const totalSeconds = totalElapsed % 60;

  const progress =
    currentStep?.duration > 0
      ? Math.min(
          100,
          ((currentStep.duration * 1000 - remainingMs) /
            (currentStep.duration * 1000)) *
            100,
        )
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
