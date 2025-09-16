import { BaseColor } from "@/theme/colors";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";

type Props = {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  size?: number;
  color?: string;
  className?: string;
  pressable?: boolean;
  onPress?: () => void;
};

export default function IconWrapper({
  icon: Icon,
  size = 28,
  color,
  className,
  pressable = false,
  onPress,
}: Props) {
  const colorScheme = useColorScheme();

  const defaultColor =
    color ?? (colorScheme === "dark" ? BaseColor[50] : BaseColor[900]);

  if (pressable)
    return (
      <TouchableOpacity className={className} onPress={onPress}>
        <Icon size={size} color={defaultColor} />
      </TouchableOpacity>
    );

  return (
    <View className={className || ""}>
      <Icon size={size} color={defaultColor} />
    </View>
  );
}
