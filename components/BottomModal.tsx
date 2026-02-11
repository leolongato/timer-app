import { BlurView } from "expo-blur";
import { PropsWithChildren, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

const { height } = Dimensions.get("window");

export default function BottomModal({ visible, onClose, children }: Props) {
  const colorScheme = useColorScheme();
  const translationY = useRef(new Animated.Value(0)).current;
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translationY.setValue(event.translationY);
      }
    })
    .onEnd((event) => {
      const reachedBottomEndOfScreen = (event.absoluteY * 100) / height >= 90;
      if (reachedBottomEndOfScreen) {
        Animated.timing(translationY, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          translationY.setValue(0);
        });
        onClose();
      } else {
        Animated.spring(translationY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    })
    .runOnJS(true);

  return (
    <View className="absolute w-full h-full">
      {visible && (
        <BlurView
          tint={
            colorScheme === "dark"
              ? "systemChromeMaterialDark"
              : "systemChromeMaterialLight"
          }
          experimentalBlurMethod="dimezisBlurView"
          intensity={visible ? 15 : 0}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Modal transparent={true} visible={visible} animationType="slide">
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={{
              transform: [{ translateY: translationY }],
            }}
            className="absolute bottom-0 items-center w-full px-8 pt-2 pb-12 shadow-lg rounded-t-xl bg-zinc-50 dark:bg-zinc-900"
          >
            <View>
              <View className="self-center w-12 h-1 m-4 rounded-full dark:bg-zinc-200 bg-zinc-400" />
            </View>
            {children}
          </Animated.View>
        </GestureDetector>
      </Modal>
    </View>
  );
}
