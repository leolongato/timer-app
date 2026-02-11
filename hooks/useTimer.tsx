import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export enum StepType {
  PREPARE = "prepare",
  WORK = "work",
  REST = "rest",
}

export type Step = { type: StepType; duration: number };
export type Round = { repeat: number; steps: Step[] };

export function useTimer(rounds: Round[], prepare: number = 10) {
  // ============================================
  // 1. GERAR SEQUÊNCIA (IGUAL AO SEU CÓDIGO)
  // ============================================
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

  // ============================================
  // 2. ESTADOS (IGUAL AO SEU CÓDIGO)
  // ============================================
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(sequence[0]?.duration ?? 0);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ============================================
  // 3. REFS PARA TIMESTAMP
  // ============================================
  const stepStartTimeRef = useRef<number>(0); // Quando o step atual começou
  const rafIdRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const backgroundTimeRef = useRef<number>(0);

  // Refs para closures
  const stepIndexRef = useRef(stepIndex);
  const sequenceRef = useRef(sequence);
  const remainingRef = useRef(remaining);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  // ============================================
  // 4. VALORES CALCULADOS (IGUAL AO SEU CÓDIGO)
  // ============================================
  const elapsedMinutes = Math.floor(elapsed / 60);
  const elapsedSeconds = Math.floor(elapsed % 60);
  const remainingMinutes = Math.floor(remaining / 60);
  const remainingSeconds = Math.floor(remaining % 60);

  const progress = useMemo(() => {
    const curStep = sequence[stepIndex];
    if (!curStep || curStep.duration === 0) return 0;
    return ((curStep.duration - remaining) / curStep.duration) * 100;
  }, [remaining, stepIndex, sequence]);

  const currentStep = useMemo(() => {
    const step = sequence[stepIndex];
    return step?.duration > 0 ? step : sequence[0];
  }, [sequence, stepIndex]);

  const currentRound = stepToRound[stepIndex] ?? 0;

  // ============================================
  // 5. KEEP AWAKE (IGUAL AO SEU CÓDIGO)
  // ============================================
  useEffect(() => {
    if (isRunning) {
      activateKeepAwakeAsync("timer");
    } else {
      deactivateKeepAwake("timer");
    }

    return () => {
      deactivateKeepAwake("timer");
    };
  }, [isRunning]);

  // ============================================
  // 6. DETECÇÃO DE FIM (IGUAL AO SEU CÓDIGO)
  // ============================================
  useEffect(() => {
    if (remaining === 0 && stepIndex + 1 === sequence.length) {
      setShowPopup(true);
      setIsRunning(false);
    }
  }, [remaining, stepIndex, sequence.length]);

  // ============================================
  // 7. RESETAR TIMESTAMP QUANDO MUDA DE STEP
  // ============================================
  useEffect(() => {
    if (isRunning) {
      stepStartTimeRef.current = Date.now();
    }
  }, [stepIndex, isRunning]);

  // ============================================
  // 8. TIMER COM TIMESTAMP (PRECISÃO MÁXIMA)
  // ============================================
  useEffect(() => {
    if (!isRunning) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    // Inicializa timestamp do step atual
    stepStartTimeRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const currentStepIndex = stepIndexRef.current;
      const currentSequence = sequenceRef.current;
      const currentStepData = currentSequence[currentStepIndex];
      const currentRemaining = remainingRef.current;

      if (!currentStepData) {
        setIsRunning(false);
        return;
      }

      // Calcula quanto tempo passou desde que o step começou
      const elapsedInStep = Math.floor((now - stepStartTimeRef.current) / 1000);
      const expectedRemaining = currentStepData.duration - elapsedInStep;

      // Se o remaining calculado é diferente do atual, atualiza
      if (expectedRemaining !== currentRemaining && expectedRemaining >= 0) {
        setRemaining(expectedRemaining);

        // Incrementa elapsed (exceto PREPARE)
        if (currentStepData.type !== StepType.PREPARE) {
          const secondsPassed = currentRemaining - expectedRemaining;
          if (secondsPassed > 0) {
            setElapsed((prev) => prev + secondsPassed);
          }
        }
      }

      // Se acabou o tempo do step, avança
      if (expectedRemaining < 0) {
        const nextIndex = currentStepIndex + 1;

        if (nextIndex < currentSequence.length) {
          // Avança para o próximo step
          setStepIndex(nextIndex);
          setRemaining(currentSequence[nextIndex].duration);
          stepStartTimeRef.current = Date.now(); // Reseta o timestamp
        } else {
          // Fim da sequência
          setRemaining(0);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isRunning]);

  // ============================================
  // 9. COMPENSAÇÃO DE BACKGROUND
  // ============================================
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        if (isRunning) {
          backgroundTimeRef.current = Date.now();
        }
      }

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (isRunning && backgroundTimeRef.current > 0) {
          const timeInBackground = Math.floor(
            (Date.now() - backgroundTimeRef.current) / 1000,
          );

          // Ajusta o stepStartTime para compensar o tempo em background
          stepStartTimeRef.current -= timeInBackground * 1000;
          backgroundTimeRef.current = 0;
        }
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isRunning]);

  // ============================================
  // 10. CONTROLES (IGUAL AO SEU CÓDIGO)
  // ============================================
  const start = useCallback(() => {
    if (!isRunning && sequence.length > 0) {
      setIsRunning(true);
    }
  }, [isRunning, sequence.length]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setStepIndex(0);
    setRemaining(sequence[0]?.duration ?? 0);
    setElapsed(0);
    setShowPopup(false);
    stepStartTimeRef.current = 0;
    backgroundTimeRef.current = 0;
  }, [sequence]);

  // ============================================
  // 11. RETORNO (IGUAL AO SEU CÓDIGO)
  // ============================================
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
