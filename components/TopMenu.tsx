import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export enum Tabs {
  TIME = "time",
  REST = "rest",
  ROUNDS = "rounds",
}

type Props = {
  onTabChange: (tab: string) => void;
  showTime?: boolean;
  showRest?: boolean;
  showRounds?: boolean;
};

const TopMenu = ({
  onTabChange,
  showTime = true,
  showRest = true,
  showRounds = true,
}: Props) => {
  const tabs = Array<string>();
  if (showTime) tabs.push(Tabs.TIME);
  if (showRest) tabs.push(Tabs.REST);
  if (showRounds) tabs.push(Tabs.ROUNDS);

  const [active, setActive] = useState<string>(tabs[0]);

  useEffect(() => {
    onTabChange(active);
  }, [active, onTabChange]);

  return (
    <View className="flex-row items-center gap-1 p-1 rounded-xl bg-zinc-200 dark:bg-zinc-800">
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
  pressable: "flex-1 py-3 px-4 rounded-lg",
  pressableActive: "flex-1 py-3 px-4 rounded-lg bg-zinc-700 dark:bg-zinc-200",
  text: "self-center uppercase text-xl font-bold text-zinc-900 dark:text-zinc-100",
  textActive:
    "self-center uppercase text-xl font-bold text-zinc-50 dark:text-zinc-900",
};

export default TopMenu;
