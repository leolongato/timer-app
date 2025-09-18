import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type TimerProgressBarType = {
  percentage: number;
  radius: number;
  strokeWidth: number;
  trackColor: string;
  progressColor: string;
  animationDuration?: number;
  children?: React.ReactNode;
};

const TimerProgressBar = ({
  percentage,
  radius,
  strokeWidth,
  trackColor,
  progressColor,
  animationDuration = 50,
  children,
}: TimerProgressBarType) => {
  const radiusAdjusted = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * radiusAdjusted;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (percentage < 100) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(100);
    }
  }, [percentage, animationDuration, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: "clamp",
  });

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        borderRadius: "100%",
      }}
    >
      <Svg width={radius * 2} height={radius * 2}>
        {/* Track */}
        <Circle
          cx={radius}
          cy={radius}
          r={radiusAdjusted}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <AnimatedCircle
          cx={radius}
          cy={radius}
          r={radiusAdjusted}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          transform={`rotate(-90 ${radius} ${radius})`} // início do topo
        />
      </Svg>
      <View
        style={StyleSheet.absoluteFill}
        className="flex items-center justify-center gap-8"
      >
        {children}
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default TimerProgressBar;
