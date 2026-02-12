import {
  IconCaretDownFilled,
  IconCaretUpFilled,
} from "@tabler/icons-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import IconWrapper from "./IconWrapper";

const ITEM_HEIGHT = 75;
const VISIBLE_ITEMS = 3;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

type NumberCarouselProps = {
  value: number;
  onValueChange: (value: number) => void;
  range: number;
  unity?: string;
};

export default function NumberCarousel({
  value,
  onValueChange,
  range,
  unity,
}: NumberCarouselProps) {
  const numbers = Array.from({ length: range }, (_, i) => i);
  const [selected, setSelected] = useState(value);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    setSelected(value);
    listRef.current?.scrollToOffset({
      offset: value * ITEM_HEIGHT,
      animated: false,
    });
  }, [value]);

  useEffect(() => {
    onValueChange(selected);
  }, [selected, onValueChange]);

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    if (index >= 0 && index < numbers.length) {
      setSelected(index);

      listRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const handleUp = () => {
    scrollToIndex(Math.max(selected - 1, 0));
  };

  const handleDown = () => {
    scrollToIndex(Math.min(selected + 1, numbers.length - 1));
  };

  return (
    <View className="flex items-center justify-center gap-2">
      <IconWrapper icon={IconCaretUpFilled} pressable onPress={handleUp} />

      <View
        style={{ height: CONTAINER_HEIGHT }}
        className="flex-row items-center justify-center gap-1 p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-800"
      >
        <FlatList
          ref={listRef}
          data={numbers}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          contentContainerStyle={{
            paddingTop: PADDING,
            paddingBottom: PADDING,
          }}
          onMomentumScrollEnd={handleMomentumEnd}
          renderItem={({ item, index }) => (
            <View
              style={{
                height: ITEM_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
                opacity: index === selected ? 1 : 0.35,
              }}
            >
              <Text className="text-6xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {item.toString().padStart(2, "0")}
              </Text>
            </View>
          )}
        />

        {unity && (
          <Text className="mt-2 text-center uppercase text-zinc-900 dark:text-zinc-50">
            {unity}
          </Text>
        )}
      </View>

      <IconWrapper icon={IconCaretDownFilled} pressable onPress={handleDown} />
    </View>
  );
}
