import { IconBarbell } from "@tabler/icons-react-native";
import { Text, View } from "react-native";
import BottomModal from "./BottomModal";
import Button from "./Button";
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
      <View className="flex items-center justify-center w-full gap-8">
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

        <Button
          className="w-full h-12 bg-zinc-900 dark:bg-zinc-50"
          textClassName="dark:text-zinc-900 text-zinc-50 text-lg font-bold uppercase"
          title="Done"
          onPress={onClose}
        />
      </View>
    </BottomModal>
  );
}
