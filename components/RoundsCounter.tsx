import React from "react";
import { Text } from "react-native";

type Props = {
  currentRound: number;
  totalRounds: number;
};

const RoundsCounter: React.FC<Props> = ({ currentRound, totalRounds }) => {
  return (
    <Text className="absolute bottom-0 mb-20 text-2xl font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-50">
      round {currentRound} / {totalRounds}
    </Text>
  );
};

export default RoundsCounter;
