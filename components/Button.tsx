import clsx from "clsx";
import { PropsWithChildren } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = PropsWithChildren<{
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}>;

export default function Button({
  title,
  onPress,
  disabled,
  className,
  textClassName,
  children,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "flex justify-center items-center gap-2 rounded-md px-3 py-1.5",
        className,
      )}
    >
      <View>
        {title && (
          <Text
            className={clsx(textClassName ?? "text-lg font-bold uppercase")}
          >
            {title}
          </Text>
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
}
