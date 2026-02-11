import SelectedTimeMenu from "@/components/SelectedTimeMenu";
import TimerController from "@/components/TimerController";
import TimerCounter from "@/components/TimerCounter";
import TimerProgressBar from "@/components/TimerProgressBar";
import TimeSelector, { WorkoutType } from "@/components/TimeSelector";
import WorkoutResult from "@/components/WorkoutResult";
import { Round, StepType, useTimer } from "@/hooks/useTimer";
import { BaseColor, ProgressColor } from "@/theme/colors";
import formatTime from "@/utils/format-time";
import React, { useState } from "react";
import { ColorSchemeName, Text, useColorScheme, View } from "react-native";

function getProgressColor(
  step: string,
  colorScheme: ColorSchemeName = "light",
): string {
  if (step === StepType.WORK) return ProgressColor.work;
  if (step === StepType.REST) return ProgressColor.rest;

  return colorScheme === "dark" ? BaseColor[50] : BaseColor[800];
}

export default function Emom() {
  const colorScheme = useColorScheme();
  const [editTime, setEditTime] = useState<boolean>(false);
  const [
    { minutes, seconds, rounds, restMinutes, restSeconds },
    setSelectedTime,
  ] = useState({
    minutes: 0,
    seconds: 0,
    rounds: 1,
    restMinutes: 0,
    restSeconds: 0,
  });

  const workoutDefinition: Round[] = [
    {
      repeat: rounds,
      steps: [
        {
          type: StepType.WORK,
          duration: minutes * 60 + seconds,
        },
      ],
    },
  ];

  const {
    currentStep,
    currentRound,
    totalRounds,
    totalMinutes,
    totalSeconds,
    totalElapsed,
    isRunning,
    showPopup,
    setShowPopup,
    start,
    stop,
    reset,
    finish,
    progress,
    remainingMinutes,
    remainingSeconds,
  } = useTimer(workoutDefinition, 10);

  return (
    <View className="items-center justify-center flex-1 bg-white dark:bg-zinc-900">
      <View className="items-center justify-center flex-1 gap-12 bg-bg">
        <View className="flex items-center justify-center w-full h-24">
          {(isRunning || progress > 0 || totalElapsed > 0) && (
            <Text
              style={{
                color: getProgressColor(currentStep?.type, colorScheme),
              }}
              className="text-5xl font-bold tracking-wide text-zinc-900 dark:text-zinc-50"
            >
              {currentStep?.type.toUpperCase()}
            </Text>
          )}
          {!isRunning && progress === 0 && totalElapsed === 0 && (
            <SelectedTimeMenu
              time={formatTime(minutes, seconds)}
              rounds={String(rounds)}
              onPress={() => setEditTime(true)}
            />
          )}
        </View>
        <TimerProgressBar
          percentage={progress}
          radius={160}
          strokeWidth={20}
          trackColor={colorScheme === "dark" ? BaseColor[700] : BaseColor[200]}
          progressColor={getProgressColor(currentStep?.type, colorScheme)}
        >
          {/* TOTAL TIME */}
          <Text className="self-center text-2xl tracking-wider uppercase text-zinc-900 dark:text-zinc-50">
            {formatTime(totalMinutes, totalSeconds)}
          </Text>

          {/* STEP COUNTER */}
          <TimerCounter
            color={getProgressColor(currentStep?.type, colorScheme)}
            minutes={remainingMinutes}
            seconds={remainingSeconds}
          />

          {/* ROUNDS */}
          <Text className="self-center text-xl tracking-wider uppercase text-zinc-900 dark:text-zinc-50">
            round {currentRound} / {totalRounds}
          </Text>
        </TimerProgressBar>

        {/* CONTROLLER */}
        <TimerController
          reset={reset}
          start={start}
          stop={stop}
          finish={finish}
          minutes={minutes}
          seconds={seconds}
          rounds={rounds}
          colorScheme={colorScheme}
          currentStep={currentStep}
          isRunning={isRunning}
        />
        {/* MODALS */}
        <TimeSelector
          initMinutes={minutes}
          initSecods={seconds}
          initRounds={rounds}
          initRestMinutes={restMinutes}
          initRestSeconds={restSeconds}
          visible={editTime}
          onClose={() => {
            setEditTime(false);
          }}
          onConfirm={(cur) => {
            setSelectedTime(cur);
          }}
          workoutType={WorkoutType.EMOM}
        />
        <WorkoutResult
          visible={showPopup}
          minutes={totalMinutes}
          seconds={totalSeconds}
          totalRounds={currentRound}
          onClose={() => {
            setShowPopup(false);
            reset();
          }}
        />
      </View>
    </View>
  );
}
