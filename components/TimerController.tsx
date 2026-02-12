import { Step, StepType } from "@/hooks/useWorkoutTimer";
import {
  IconCheck,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotate,
} from "@tabler/icons-react-native";
import { ColorSchemeName, TouchableOpacity, View } from "react-native";

type Props = {
  reset(): void; // reinicia o timer
  start(): void; // inicia
  stop(): void; // pausa
  finish(): void; // finaliza no tempo atual
  colorScheme: ColorSchemeName;
  isRunning: boolean;
  minutes: number;
  seconds: number;
  rounds: number;
  currentStep?: Step;
};

const TimerController: React.FC<Props> = ({
  reset,
  start,
  stop,
  finish,
  colorScheme,
  isRunning,
  minutes,
  seconds,
  rounds,
  currentStep,
}) => {
  const isDisabled = minutes + seconds === 0 || rounds === 0;

  return (
    <View className="flex-row items-center justify-center gap-12">
      {/* Reset / Restart */}
      <TouchableOpacity
        onPress={reset}
        className="p-4 rotate-180 border rounded-full border-zinc-800 dark:border-zinc-50"
      >
        <IconRotate
          size={24}
          color={colorScheme === "dark" ? "#f8fafc" : "#1e293b"}
        />
      </TouchableOpacity>

      {/* Start / Pause */}
      <TouchableOpacity
        onPress={() => (isRunning ? stop() : start())}
        disabled={isDisabled}
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

      {/* Finish */}
      <TouchableOpacity
        onPress={finish}
        disabled={isDisabled || currentStep?.type === StepType.PREPARE}
        className="p-4 border rounded-full border-zinc-800 dark:border-zinc-50 disabled:opacity-25"
      >
        <IconCheck
          size={24}
          color={colorScheme === "dark" ? "#f8fafc" : "#1e293b"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TimerController;
