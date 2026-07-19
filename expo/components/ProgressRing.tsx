import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import { GRADIENT } from "@/constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  children?: React.ReactNode;
  duration?: number;
};

export default function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 14,
  trackColor = "rgba(255,255,255,0.08)",
  children,
  duration = 900,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withTiming(Math.max(0, Math.min(1, progress)), { duration });
  }, [progress, anim, duration]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - anim.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={GRADIENT[0]} />
            <Stop offset="1" stopColor={GRADIENT[1]} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={{ alignItems: "center", justifyContent: "center" }}>{children}</View>
    </View>
  );
}

export function ProgressBar({ progress, color = GRADIENT[0], track = "rgba(255,255,255,0.08)" }: { progress: number; color?: string; track?: string }) {
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: track, overflow: "hidden" }}>
      <View style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%`, height: "100%", backgroundColor: color, borderRadius: 3 }} />
    </View>
  );
}

export function GradientText({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ color: GRADIENT[0] }, style]}>{children}</Text>;
}
