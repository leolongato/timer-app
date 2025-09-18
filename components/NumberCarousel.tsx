import {
  IconCaretDownFilled,
  IconCaretUpFilled,
} from "@tabler/icons-react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeSyntheticEvent, ScrollView, Text, View } from "react-native";
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
  const isScrollingRef = useRef(false);

  useEffect(() => {
    onValueChange(numbers[selected]);
  }, [numbers, onValueChange, selected]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selected * ITEM_HEIGHT,
      animated: false,
    });
  }, []);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    isScrollingRef.current = true;
    scrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: true });

    setTimeout(() => {
      isScrollingRef.current = false;
      setSelected(index);
    }, 200);
  };

  const handleUp = () => {
    const next = Math.max(selected - 1, 0);
    if (!isScrollingRef.current) scrollToIndex(next);
  };

  const handleDown = () => {
    const next = Math.min(selected + 1, numbers.length - 1);
    if (!isScrollingRef.current) scrollToIndex(next);
  };

  const handleScroll = (event: NativeSyntheticEvent<any>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < numbers.length && index !== selected) {
      setSelected(index);
    }
  };

  return (
    <View className="flex items-center justify-center gap-2">
      <IconWrapper icon={IconCaretUpFilled} pressable onPress={handleUp} />

      <View
        style={{ height: CONTAINER_HEIGHT }}
        className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-800"
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="normal"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          contentContainerStyle={{
            paddingTop: PADDING,
            paddingBottom: PADDING,
            paddingLeft: 0,
            paddingRight: 0,
          }}
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
