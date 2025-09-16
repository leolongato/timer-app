import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export enum Tabs {
  TIME = "time",
  REST = "rest",
  ROUNDS = "rounds",
}

type Props = {
  onTabChange: (tab: string) => void;
};

const TopMenu = ({ onTabChange }: Props) => {
  const tabs = ["time", "rest", "rounds"];
  const [active, setActive] = useState<string>(tabs[0]);

  useEffect(() => {
    onTabChange(active);
  }, [active, onTabChange]);

  return (
    <View className="flex-row items-center justify-center p-2 rounded-md bg-zinc-300 dark:bg-zinc-800">
      {tabs.map((val, key) => (
        <Pressable
          key={key}
          className={active === val ? styles.pressableActive : styles.pressable}
          onPress={() => setActive(val)}
        >
          <Text className={active === val ? styles.textActive : styles.text}>
            {val}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = {
  pressable: "flex-1 h-full rounded-md",
  pressableActive: "flex-1 h-full rounded-md bg-zinc-400 dark:bg-zinc-200",
  text: "self-center uppercase text-xl font-bold text-zinc-600 dark:text-zinc-200",
  textActive:
    "self-center uppercase text-xl font-bold text-zinc-50 dark:text-zinc-900",
};

export default TopMenu;
