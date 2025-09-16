import {
  IconCaretDownFilled,
  IconCaretUpFilled,
} from "@tabler/icons-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
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
};

export default function NumberCarousel({
  value,
  onValueChange,
  range,
}: NumberCarouselProps) {
  const numbers = Array.from({ length: range }, (_, i) => i);
  const [selected, setSelected] = useState(value);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    onValueChange(numbers[selected]);
  }, [numbers, onValueChange, selected]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selected * ITEM_HEIGHT,
      animated: false,
    });
  }, [selected]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      y: value * ITEM_HEIGHT,
      animated: false,
    });
  }, [value]);

  const handleUp = () => {
    setSelected((prev) => Math.max(prev - 1, 0));
  };

  const handleDown = () => {
    setSelected((prev) => Math.min(prev + 1, numbers.length - 1));
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (index >= 0 && index < numbers.length) {
      setSelected(numbers[index]);
    }
  };

  return (
    <View className="flex items-center justify-center gap-2">
      <IconWrapper icon={IconCaretUpFilled} pressable onPress={handleUp} />

      {/* ScrollView do carrossel */}
      <View
        style={{ height: CONTAINER_HEIGHT }}
        className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-800"
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingTop: PADDING,
            paddingBottom: PADDING,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {numbers.map((item, index) => (
            <View
              key={index}
              style={{
                height: ITEM_HEIGHT,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                opacity: item === selected ? 1 : 0.4,
              }}
            >
              <Text className="text-6xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {item.toString().padStart(2, "0")}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <IconWrapper pressable onPress={handleDown} icon={IconCaretDownFilled} />
    </View>
  );
}
