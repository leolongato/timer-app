import SelectedTimeMenu from "@/components/SelectedTimeMenu";
import TimerController from "@/components/TimerController";
import TimerCounter from "@/components/TimerCounter";
import TimerProgressBar from "@/components/TimerProgressBar";
import TimeSelector, { WorkoutType } from "@/components/TimeSelector";
import WorkoutResult from "@/components/WorkoutResult";
import { StepType, useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { BaseColor } from "@/theme/colors";
import formatTime from "@/utils/format-time";
import { getProgressColor } from "@/utils/get-progress-color";
import { useMemo, useState } from "react";
import { Text, useColorScheme, useWindowDimensions, View } from "react-native";

export default function Index() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const colorScheme = useColorScheme();
  const [editTime, setEditTime] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  const steps = useMemo(() => {
    return [
      { type: StepType.PREPARE, duration: 10 },
      { type: StepType.WORK, duration: minutes * 60 + seconds },
    ];
  }, [minutes, seconds]);

  const {
    currentStep,
    progress,
    remainingMinutes,
    remainingSeconds,
    handleStartResume,
    pause,
    reset,
    finish,
    isRunning,
    totalDuration,
    remaining,
  } = useWorkoutTimer({
    steps,
    onFinish: () => setShowPopup(true),
  });

  const hasStarted = isRunning || progress > 0;

  return (
    <View className="items-center justify-center flex-1 bg-zinc-50 dark:bg-zinc-900">
      <View className="items-center justify-center flex-1 w-full gap-12">
        {/* HEADER */}
        <View className="flex items-center justify-center w-full h-24">
          {hasStarted && currentStep && (
            <Text
              style={{
                color: getProgressColor(currentStep.type, colorScheme),
              }}
              className="text-5xl font-bold tracking-wide"
            >
              {currentStep.type.toUpperCase()}
            </Text>
          )}

          {!hasStarted && (
            <SelectedTimeMenu
              time={formatTime(minutes, seconds)}
              onPress={() => setEditTime(true)}
            />
          )}
        </View>

        {/* TIMER */}
        <TimerProgressBar
          percentage={progress}
          radius={160}
          strokeWidth={20}
          trackColor={colorScheme === "dark" ? BaseColor[700] : BaseColor[200]}
          progressColor={
            currentStep
              ? getProgressColor(currentStep.type, colorScheme)
              : "#999"
          }
        >
          <TimerCounter
            color={
              currentStep
                ? getProgressColor(currentStep.type, colorScheme)
                : "#999"
            }
            minutes={
              currentStep.type === StepType.PREPARE
                ? remainingMinutes
                : Math.floor((totalDuration - remaining) / 60)
            }
            seconds={
              currentStep.type === StepType.PREPARE
                ? remainingSeconds
                : (totalDuration - remaining) % 60
            }
          />
        </TimerProgressBar>

        {/* CONTROLLER */}
        <TimerController
          reset={reset}
          start={handleStartResume}
          stop={pause}
          finish={finish}
          minutes={minutes}
          seconds={seconds}
          rounds={rounds}
          colorScheme={colorScheme}
          currentStep={currentStep}
          isRunning={isRunning}
        />

        {/* MODAL DE SELEÇÃO */}
        <TimeSelector
          initMinutes={minutes}
          initSecods={seconds}
          initRounds={rounds}
          initRestMinutes={restMinutes}
          initRestSeconds={restSeconds}
          visible={editTime}
          onClose={() => setEditTime(false)}
          onConfirm={(cur) => setSelectedTime(cur)}
          workoutType={WorkoutType.FORTIME}
        />

        {/* RESULTADO FINAL */}
        <WorkoutResult
          visible={showPopup}
          totalTime={totalDuration - remaining}
          totalRounds={rounds}
          onClose={() => {
            setShowPopup(false);
            reset();
          }}
          isInterval={false}
        />
      </View>
    </View>
  );
}
