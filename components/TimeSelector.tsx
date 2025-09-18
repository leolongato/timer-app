import { IconClockCog } from "@tabler/icons-react-native";
import { PropsWithChildren, useEffect, useState } from "react";
import { Text, View } from "react-native";
import BottomModal from "./BottomModal";
import Button from "./Button";
import IconWrapper from "./IconWrapper";
import NumberCarousel from "./NumberCarousel";
import TopMenu, { Tabs } from "./TopMenu";

export enum WorkoutType {
  FORTIME = "fortime",
  EMOM = "emom",
  INTERVALS = "intervals",
}

type Props = PropsWithChildren<{
  initMinutes: number;
  initSecods: number;
  initRounds: number;
  initRestMinutes: number;
  initRestSeconds: number;
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: {
    minutes: number;
    seconds: number;
    restMinutes: number;
    restSeconds: number;
    rounds: number;
  }) => void;
  workoutType: WorkoutType;
}>;

const TimeSelector = ({
  initMinutes,
  initSecods,
  initRestMinutes,
  initRestSeconds,
  visible,
  onClose,
  onConfirm,
  initRounds,
  workoutType,
}: Props) => {
  const [minutes, setMinutes] = useState<number>(initMinutes);
  const [seconds, setSeconds] = useState<number>(initSecods);
  const [rounds, setRounds] = useState<number>(initRounds);
  const [restMinutes, setRestMinutes] = useState<number>(initRestMinutes);
  const [restSeconds, setRestSeconds] = useState<number>(initRestSeconds);
  const [tab, setTab] = useState<string>(Tabs.TIME);

  useEffect(() => {
    if (visible) {
      setMinutes(initMinutes);
      setSeconds(initSecods);
      setRounds(initRounds);
      setRestMinutes(initRestMinutes);
      setRestSeconds(initRestSeconds);
    }
  }, [
    visible,
    initMinutes,
    initSecods,
    initRounds,
    initRestMinutes,
    initRestSeconds,
  ]);

  const handleDone = () => {
    onConfirm({
      minutes,
      seconds,
      rounds,
      restMinutes,
      restSeconds,
    });
    onClose();
  };

  return (
    <BottomModal visible={visible} onClose={onClose}>
      <View className="flex items-center justify-center gap-4">
        {workoutType === WorkoutType.INTERVALS && (
          <TopMenu onTabChange={(activeTab) => setTab(activeTab)} />
        )}
        {workoutType === WorkoutType.EMOM && (
          <TopMenu
            showRest={false}
            onTabChange={(activeTab) => setTab(activeTab)}
          />
        )}
        {workoutType === WorkoutType.FORTIME && (
          <View className="flex-row items-center justify-center gap-4">
            <IconWrapper icon={IconClockCog} />
            <Text className="text-3xl font-bold uppercase text-zinc-900 dark:text-zinc-50">
              Set the time
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-center">
          {tab === Tabs.TIME && (
            <>
              <NumberCarousel
                range={60}
                value={minutes}
                onValueChange={setMinutes}
              />
              <Text className="m-2 text-4xl font-extrabold text-center text-zinc-900 dark:text-zinc-50">
                :
              </Text>
              <NumberCarousel
                range={60}
                value={seconds}
                onValueChange={setSeconds}
              />
            </>
          )}
          {tab === Tabs.REST && (
            <>
              <NumberCarousel
                range={60}
                value={restMinutes}
                onValueChange={setRestMinutes}
              />
              <Text className="m-2 text-4xl font-extrabold text-center text-zinc-900 dark:text-zinc-50">
                :
              </Text>
              <NumberCarousel
                range={60}
                value={restSeconds}
                onValueChange={setRestSeconds}
              />
            </>
          )}
          {tab === Tabs.ROUNDS && (
            <NumberCarousel
              range={60}
              value={rounds}
              onValueChange={setRounds}
            />
          )}
        </View>
        <View className="flex-row items-center justify-center w-full gap-2">
          <Button
            className="w-1/2 h-12 bg-transparent border dark:border-zinc-50"
            textClassName="dark:text-zinc-50 text-zinc-900 text-lg font-bold uppercase"
            title="Cancel"
            onPress={onClose}
          />
          <Button
            className="w-1/2 h-12 bg-zinc-900 dark:bg-zinc-50"
            textClassName="dark:text-zinc-900 text-zinc-50 text-lg font-bold uppercase"
            title="Done"
            onPress={handleDone}
          />
        </View>
      </View>
    </BottomModal>
  );
};

export default TimeSelector;
