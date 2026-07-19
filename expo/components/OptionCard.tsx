import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { RADIUS } from "@/constants/theme";
import { useAppStore } from "@/providers/AppStore";

type Props = {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
  emoji?: string;
};

export default function OptionCard({ label, sublabel, selected, onPress, multi, emoji }: Props) {
  const { palette } = useAppStore();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected ? palette.accentDim : palette.card,
          borderColor: selected ? palette.accent : palette.border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.left}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
          {sublabel ? <Text style={[styles.sub, { color: palette.textMuted }]}>{sublabel}</Text> : null}
        </View>
      </View>
      <View
        style={[
          multi ? styles.box : styles.radio,
          {
            borderColor: selected ? palette.accent : palette.textFaint,
            backgroundColor: selected ? palette.accent : "transparent",
          },
        ]}
      >
        {selected ? <Check size={16} color="#fff" strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 12,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  emoji: { fontSize: 22 },
  label: { fontSize: 16.5, fontWeight: "700" },
  sub: { fontSize: 13, marginTop: 2, fontWeight: "500" },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
