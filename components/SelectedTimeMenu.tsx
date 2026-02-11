import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SelectedTimeMenuProps = {
  time: string;
  rest?: string;
  rounds?: string;
  onPress(): void;
};

const styles = {
  container: "flex-row items-center justify-center gap-4",
  card: "p-4 rounded-lg w-28 bg-zinc-100 dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-50",
  label: "text-sm text-center text-zinc-600 dark:text-zinc-400",
  value: "text-xl font-bold text-center text-zinc-900 dark:text-zinc-50",
};

const SelectedTimeMenu: React.FC<SelectedTimeMenuProps> = ({
  time,
  rest,
  rounds,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} className={styles.container}>
      {/* WORK */}
      <View className={styles.card}>
        <Text className={styles.label}>WORK</Text>
        <Text className={styles.value}>{time}</Text>
      </View>

      {/* REST */}
      {rest !== undefined && (
        <View className={styles.card}>
          <Text className={styles.label}>REST</Text>
          <Text className={styles.value}>{rest}</Text>
        </View>
      )}

      {/* ROUNDS */}
      {rounds !== undefined && (
        <View className={styles.card}>
          <Text className={styles.label}>ROUNDS</Text>
          <Text className={styles.value}>{rounds}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SelectedTimeMenu;
