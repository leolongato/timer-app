import { BlurView } from "expo-blur";
import { PropsWithChildren } from "react";
import { Modal, StyleSheet, useColorScheme, View } from "react-native";

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export default function BottomModal({ visible, onClose, children }: Props) {
  const colorScheme = useColorScheme();

  return (
    <View className="absolute w-full h-full">
      {visible && (
        <BlurView
          onTouchEnd={() => console.log("aqui")}
          tint={
            colorScheme === "dark"
              ? "systemChromeMaterialLight"
              : "systemChromeMaterialDark"
          }
          experimentalBlurMethod="dimezisBlurView" // For Android
          intensity={15}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Modal transparent={true} visible={visible} animationType="slide">
        <View className="absolute bottom-0 items-center w-full gap-8 p-8 pb-12 shadow-lg rounded-t-xl bg-zinc-50 dark:bg-zinc-900">
          {children}
        </View>
      </Modal>
    </View>
  );
}
