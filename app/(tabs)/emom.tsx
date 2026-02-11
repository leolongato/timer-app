import IconWrapper from "@/components/IconWrapper";
import TimerProgressBar from "@/components/TimerProgressBar";
import TimeSelector, { WorkoutType } from "@/components/TimeSelector";
import WorkoutResult from "@/components/WorkoutResult";
import { Round, StepType, useTimer } from "@/hooks/useTimer";
import { BaseColor, ProgressColor } from "@/theme/colors";
import {
  IconCheck,
  IconClockEdit,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotate,
} from "@tabler/icons-react-native";
import React, { useState } from "react";
import {
  ColorSchemeName,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

function getProgressColor(
  step: string,
  colorScheme: ColorSchemeName = "light"
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
    elapsed,
    elapsedMinutes,
    elapsedSeconds,
    isRunning,
    showPopup,
    setShowPopup,
    start,
    stop,
    reset,
    progress,
    remainingMinutes,
    remainingSeconds,
  } = useTimer(workoutDefinition, 10);

  return (
    <View className="items-center justify-center flex-1 bg-white dark:bg-zinc-900">
      <View className="items-center justify-center flex-1 gap-12 bg-bg">
        {/* STEP NAME */}
        <Text
          style={{
            color: getProgressColor(currentStep?.type, colorScheme),
          }}
          className="text-5xl font-bold tracking-wide text-zinc-900 dark:text-zinc-50"
        >
          {currentStep?.type.toUpperCase()}
        </Text>
        <TimerProgressBar
          percentage={progress}
          radius={160}
          strokeWidth={20}
          trackColor={colorScheme === "dark" ? BaseColor[700] : BaseColor[200]}
          progressColor={getProgressColor(currentStep?.type, colorScheme)}
        >
          {/* EDIT TIME */}
          {!isRunning && elapsed === 0 && (
            <IconWrapper
              icon={IconClockEdit}
              pressable={true}
              size={38}
              className="absolute top-0 right-0 rounded-full"
              onPress={() => setEditTime(true)}
            />
          )}

          {/* TOTAL TIME */}
          <Text className="self-center text-2xl tracking-wider uppercase text-zinc-900 dark:text-zinc-50">
            {`${elapsedMinutes.toString().padStart(2, "0")}:${elapsedSeconds.toString().padStart(2, "0")}`}
          </Text>

          {/* STEP COUNTER */}
          <Text
            style={{
              color: getProgressColor(currentStep?.type, colorScheme),
            }}
            className="font-extrabold text-8xl text-zinc-900 dark:text-zinc-50"
          >
            {`${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds
              .toString()
              .padStart(2, "0")}`}
          </Text>

          {/* ROUNDS */}
          <Text className="self-center text-xl tracking-wider uppercase text-zinc-900 dark:text-zinc-50">
            round {currentRound} / {totalRounds}
          </Text>
        </TimerProgressBar>

        {/* CONTROLLER */}
        <View className="flex-row items-center justify-center gap-12">
          <TouchableOpacity
            onPress={reset}
            className="p-4 rotate-180 border rounded-full border-zinc-800 dark:border-zinc-50"
          >
            <IconRotate
              size={24}
              color={colorScheme === "dark" ? "#f8fafc" : "#1e293b"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (isRunning ? stop() : start())}
            disabled={minutes + seconds === 0 || rounds === 0}
            className="p-4 rounded-full bg-zinc-800 dark:bg-zinc-50 disabled:opacity-50"
          >
            {!isRunning ? (
              <IconPlayerPlayFilled
                size={52}
                color={colorScheme === "dark" ? "#000000" : "#f8fafc"}
              />
            ) : (
              <IconPlayerPauseFilled
                size={52}
                color={colorScheme === "dark" ? "#000000" : "#f8fafc"}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={currentStep.type === StepType.PREPARE}
            className="p-4 border rounded-full border-zinc-800 dark:border-zinc-50 disabled:opacity-25"
            onPress={() => {
              stop();
              setShowPopup(true);
            }}
          >
            <IconCheck
              size={24}
              color={colorScheme === "dark" ? "#f8fafc" : "#1e293b"}
            />
          </TouchableOpacity>
        </View>

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
          minutes={elapsedMinutes}
          seconds={elapsedSeconds}
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
