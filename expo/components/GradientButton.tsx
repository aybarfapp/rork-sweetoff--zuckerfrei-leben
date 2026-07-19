import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { GRADIENT, RADIUS } from "@/constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: "solid" | "ghost";
  icon?: React.ReactNode;
};

export default function GradientButton({
  label,
  onPress,
  disabled,
  loading,
  style,
  variant = "solid",
  icon,
}: Props) {
  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    onPress();
  };

  if (variant === "ghost") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.ghost,
          { opacity: pressed ? 0.7 : disabled ? 0.4 : 1 },
          style,
        ]}
      >
        <Text style={styles.ghostLabel}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }], opacity: disabled ? 0.45 : 1 }, style]}
    >
      <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.solid}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.row}>
            {icon}
            <Text style={styles.solidLabel}>{label}</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  solid: {
    height: 58,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#FF5A2E",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  solidLabel: { color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.2 },
  ghost: { height: 52, alignItems: "center", justifyContent: "center" },
  ghostLabel: { color: "#9A9AA4", fontSize: 15, fontWeight: "600" },
});
