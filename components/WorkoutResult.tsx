import { IconBarbell } from "@tabler/icons-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import BottomModal from "./BottomModal";
import DisplayTime from "./DisplayTime";
import IconWrapper from "./IconWrapper";

type Props = {
  visible: boolean;
  minutes: number;
  seconds: number;
  totalRounds: number;
  onClose: () => void;
  isInterval?: boolean;
};

export default function WorkoutResult({
  visible,
  minutes,
  seconds,
  totalRounds,
  onClose,
  isInterval = true,
}: Props) {
  return (
    <BottomModal visible={visible} onClose={onClose}>
      <View className="flex-row items-center justify-center gap-2">
        <IconWrapper className="ml-auto" icon={IconBarbell} size={42} />
        <Text className="text-2xl font-bold text-center uppercase text-zinc-800 dark:text-zinc-50">
          Workout Finished!
        </Text>
      </View>

      <DisplayTime minutes={minutes} seconds={seconds} />

      {isInterval && (
        <View className="flex-row gap-1 my-6">
          <Text className="text-xl font-semibold text-zinc-800 dark:text-zinc-50">
            Rounds completed:
          </Text>
          <Text className="text-xl font-extrabold text-zinc-800 dark:text-zinc-50">
            {totalRounds}
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="w-full p-3 dark:bg-zinc-500 bg-zinc-900 rounded-xl"
        onPress={onClose}
      >
        <Text className="text-lg font-bold text-center text-zinc-50">Done</Text>
      </TouchableOpacity>
    </BottomModal>
  );
}
