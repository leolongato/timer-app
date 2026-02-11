import formatTime from "@/utils/format-time";
import { Text } from "react-native";

export enum Tabs {
  TIME = "time",
  REST = "rest",
  ROUNDS = "rounds",
}

type Props = {
  minutes: number;
  seconds: number;
  color: string;
};

const TimerCounter = ({ minutes, seconds, color }: Props) => {
  return (
    <Text
      style={{
        color: color,
        fontVariant: ["tabular-nums"],
        fontFamily: "monospace",
        letterSpacing: 2,
      }}
      className="font-extrabold text-8xl"
    >
      {formatTime(minutes, seconds)}
    </Text>
  );
};

export default TimerCounter;
