import {
  IconAlarm,
  IconAlarmFilled,
  IconCircleNumber1,
  IconCircleNumber1Filled,
  IconClockHour8,
  IconClockHour8Filled,
} from "@tabler/icons-react-native";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import IconWrapper from "@/components/IconWrapper";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { BaseColor } from "@/theme/colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarPosition: "bottom",
        tabBarActiveTintColor:
          colorScheme === "dark" ? BaseColor[50] : BaseColor[900],
        tabBarStyle: Platform.select({
          ios: {
            borderTopWidth: 0.2,
            borderTopColor:
              colorScheme === "dark" ? BaseColor[700] : BaseColor[200],
            position: "absolute",
            elevation: 0,
            backgroundColor: "transparent",
          },
          default: {
            borderTopWidth: 0.2,
            borderTopColor:
              colorScheme === "dark" ? BaseColor[600] : BaseColor[100],
            backgroundColor:
              colorScheme === "dark" ? BaseColor[700] : BaseColor[50],
            elevation: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "For Time",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <IconWrapper
                icon={IconClockHour8Filled}
                size={28}
                color={color}
              />
            ) : (
              <IconWrapper icon={IconClockHour8} size={28} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="emom"
        options={{
          title: "EMOM",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <IconWrapper
                icon={IconCircleNumber1Filled}
                size={28}
                color={color}
              />
            ) : (
              <IconWrapper icon={IconCircleNumber1} size={28} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="intervals"
        options={{
          title: "Intervals",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <IconWrapper icon={IconAlarmFilled} size={28} color={color} />
            ) : (
              <IconWrapper icon={IconAlarm} size={28} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
