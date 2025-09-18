import { Text, View } from "react-native";

type Props = {
  minutes: number;
  seconds: number;
};

const DisplayTime = ({ minutes, seconds }: Props) => {
  return (
    <View className="flex-row items-center justify-center gap-1">
      <View className="items-center justify-center">
        <Text className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {minutes.toString().padStart(2, "0")}
        </Text>
        <Text className="uppercase text-zinc-900 dark:text-zinc-50">
          minutes
        </Text>
      </View>
      <Text className="self-start text-4xl font-extrabold text-center text-zinc-900 dark:text-zinc-50">
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
  );
};

export default DisplayTime;
