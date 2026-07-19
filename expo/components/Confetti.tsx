import { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const COLORS = ["#FF4D2E", "#FF7A00", "#FFB020", "#34D07F", "#FFFFFF"];
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type Piece = {
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
  rounded: boolean;
};

/**
 * Lightweight celebratory confetti burst. Renders `count` pieces that fall and
 * fade once, then calls `onDone`. Non-interactive overlay.
 */
export default function Confetti({ count = 90, onDone }: { count?: number; onDone?: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * SCREEN_W,
        size: 7 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 400,
        duration: 1600 + Math.random() * 1400,
        drift: (Math.random() - 0.5) * 160,
        rounded: Math.random() > 0.5,
      })),
    [count],
  );

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2600,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => onDone?.());
  }, [progress, onDone]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, SCREEN_H + 60],
        });
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.drift],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${p.drift > 0 ? 720 : -720}deg`],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 1, 0],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.rounded ? p.size / 2 : 2,
              opacity,
              transform: [{ translateY }, { translateX }, { rotate }],
            }}
          />
        );
      })}
    </View>
  );
}
