import { Step, StepType } from "@/hooks/useTimer";
import {
  IconCheck,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotate,
} from "@tabler/icons-react-native";
import { ColorSchemeName, TouchableOpacity, View } from "react-native";

type Props = {
  reset(): void;
  start(): void;
  stop(): void;
  finish(): void;
  colorScheme: ColorSchemeName;
  isRunning: boolean;
  minutes: number;
  seconds: number;
  rounds: number;
  currentStep: Step;
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
  return (
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
        onPress={finish}
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
