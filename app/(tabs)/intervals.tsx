import RoundsCounter from "@/components/RoundsCounter";
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
import { Text, useColorScheme, View } from "react-native";

export default function Index() {
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
    const stepsList = [{ type: StepType.PREPARE, duration: 10, round: 0 }];
    for (let i = 0; i < rounds; i++) {
      stepsList.push({
        type: StepType.WORK,
        duration: minutes * 60 + seconds,
        round: i + 1,
      });
      stepsList.push({
        type: StepType.REST,
        duration: restMinutes * 60 + restSeconds,
        round: i + 1,
      });
    }
    return stepsList;
  }, [minutes, seconds, restMinutes, restSeconds]);

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
    totalElapsed,
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
              rounds={String(rounds)}
              rest={formatTime(restMinutes, restSeconds)}
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
            minutes={remainingMinutes}
            seconds={remainingSeconds}
          />
          <RoundsCounter
            currentRound={currentStep.round || 0}
            totalRounds={rounds}
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
          workoutType={WorkoutType.INTERVALS}
        />

        {/* RESULTADO FINAL */}
        <WorkoutResult
          visible={showPopup}
          totalTime={totalElapsed}
          totalRounds={rounds}
          onClose={() => {
            setShowPopup(false);
            reset();
          }}
          isInterval={true}
        />
      </View>
    </View>
  );
}
