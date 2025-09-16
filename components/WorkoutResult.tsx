import { IconBarbell } from "@tabler/icons-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import BottomModal from "./BottomModal";
import IconWrapper from "./IconWrapper";

type Props = {
  visible: boolean;
  minutes: number;
  seconds: number;
  totalRounds: number;
  onClose: () => void;
};

export default function WorkoutResult({
  visible,
  minutes,
  seconds,
  totalRounds,
  onClose,
}: Props) {
  return (
    <BottomModal visible={visible} onClose={onClose}>
      <View className="flex-row items-center justify-center mb-4">
        <IconWrapper icon={IconBarbell} size={42} />
        <Text className="ml-2 text-2xl font-bold text-zinc-800 dark:text-zinc-50">
          Workout Finished!
        </Text>
      </View>

      <View className="flex-row items-center justify-center gap-1">
        <View className="items-center justify-center">
          <Text className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {minutes.toString().padStart(2, "0")}
          </Text>
          <Text className="uppercase text-zinc-900 dark:text-zinc-50">
            minutes
          </Text>
        </View>
        <Text className="self-start mx-2 text-4xl font-extrabold text-center text-zinc-900 dark:text-zinc-50">
          :
        </Text>
        <View className="items-center justify-center">
          <Text className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {seconds.toString().padStart(2, "0")}
          </Text>
          <Text className="uppercase text-zinc-900 dark:text-zinc-50">
            seconds
          </Text>
        </View>
      </View>

      <View className="flex-row gap-1 my-6">
        <Text className="text-xl font-semibold text-zinc-800 dark:text-zinc-50">
          Rounds completed:
        </Text>
        <Text className="text-xl font-extrabold text-zinc-800 dark:text-zinc-50">
          {totalRounds}
        </Text>
      </View>

      <TouchableOpacity
        className="w-full p-3 dark:bg-zinc-500 bg-zinc-900 rounded-xl"
        onPress={onClose}
      >
        <Text className="text-lg font-bold text-center text-zinc-50">Done</Text>
      </TouchableOpacity>
    </BottomModal>
  );
}
