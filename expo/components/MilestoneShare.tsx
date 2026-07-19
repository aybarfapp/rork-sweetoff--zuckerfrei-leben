import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Flame, Share2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Confetti from "@/components/Confetti";
import Logo from "@/components/Logo";
import { GRADIENT, RADIUS } from "@/constants/theme";
import { useAppStore } from "@/providers/AppStore";

/**
 * Watches for a reached-but-uncelebrated milestone and offers an optional
 * "share with community" screen with a prefilled, editable message.
 * Milestone posting is the ONLY way a user can post to the community.
 */
export default function MilestoneShare() {
  const { palette, pendingMilestone, markMilestoneCelebrated, shareMilestone } = useAppStore();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState<string>("");
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    if (pendingMilestone !== null && day === null) {
      setDay(pendingMilestone);
      setText(`Tag ${pendingMilestone} erreicht 🔥`);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [pendingMilestone, day]);

  if (day === null) return null;

  const skip = () => {
    markMilestoneCelebrated(day);
    setDay(null);
  };

  const shareToCommunity = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    shareMilestone(day, text.trim() || `Tag ${day} erreicht 🔥`);
    setDay(null);
  };

  const shareExternal = async () => {
    try {
      await Share.share({ message: `Ich bin seit ${day} Tagen zuckerfrei 🔥 – mit SweetOff. #SweetOff` });
    } catch {
      // user dismissed the share sheet
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={skip}>
      <View style={styles.backdrop}>
        <Confetti count={110} />
        <View style={[styles.sheet, { backgroundColor: palette.bgElevated, paddingBottom: insets.bottom + 20 }]}>
          <Pressable onPress={skip} hitSlop={12} style={[styles.close, { backgroundColor: palette.card }]}>
            <X size={18} color={palette.textMuted} />
          </Pressable>

          <Text style={[styles.kicker, { color: palette.accent }]}>MEILENSTEIN ERREICHT</Text>
          <Text style={[styles.title, { color: palette.text }]}>Mit der Community teilen?</Text>

          {/* Shareable graphic card */}
          <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.graphicCard}>
            <View style={styles.graphicTop}>
              <Logo size={30} />
              <Text style={styles.graphicBrand}>SweetOff</Text>
            </View>
            <Flame size={44} color="#fff" fill="rgba(255,255,255,0.35)" />
            <Text style={styles.graphicDay}>Ich bin seit {day} Tagen zuckerfrei</Text>
            <Text style={styles.graphicSub}>Ein Craving nach dem anderen.</Text>
          </LinearGradient>

          <Text style={[styles.editLabel, { color: palette.textMuted }]}>Dein Beitrag (bearbeitbar)</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            style={[styles.input, { backgroundColor: palette.card, color: palette.text, borderColor: palette.border }]}
            placeholder={`Tag ${day} erreicht 🔥`}
            placeholderTextColor={palette.textFaint}
            multiline
            maxLength={180}
          />

          <Pressable onPress={shareToCommunity} style={styles.primaryBtn}>
            <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryInner}>
              <Text style={styles.primaryText}>Teilen</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable onPress={shareExternal} style={[styles.secondaryBtn, { borderColor: palette.border, backgroundColor: palette.card }]}>
              <Share2 size={17} color={palette.text} />
              <Text style={[styles.secondaryText, { color: palette.text }]}>Extern teilen</Text>
            </Pressable>
            <Pressable onPress={skip} style={[styles.secondaryBtn, { borderColor: palette.border, backgroundColor: palette.card }]}>
              <Text style={[styles.secondaryText, { color: palette.textMuted }]}>Überspringen</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, paddingHorizontal: 22, paddingTop: 22 },
  close: { position: "absolute", top: 16, right: 16, width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", zIndex: 2 },
  kicker: { fontSize: 12.5, fontWeight: "900", letterSpacing: 1.4 },
  title: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5, marginTop: 6, marginBottom: 18 },

  graphicCard: { borderRadius: RADIUS.lg, padding: 22, alignItems: "center", gap: 10 },
  graphicTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  graphicBrand: { color: "#fff", fontSize: 17, fontWeight: "900", letterSpacing: 0.5 },
  graphicDay: { color: "#fff", fontSize: 21, fontWeight: "900", textAlign: "center", letterSpacing: -0.4, marginTop: 2 },
  graphicSub: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: "600" },

  editLabel: { fontSize: 13, fontWeight: "700", marginTop: 20, marginBottom: 8 },
  input: { borderRadius: RADIUS.md, borderWidth: 1, padding: 14, fontSize: 15.5, fontWeight: "500", minHeight: 56, textAlignVertical: "top" },

  primaryBtn: { marginTop: 16, borderRadius: RADIUS.pill, overflow: "hidden" },
  primaryInner: { paddingVertical: 17, alignItems: "center" },
  primaryText: { color: "#fff", fontSize: 16.5, fontWeight: "800" },

  secondaryRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  secondaryBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: RADIUS.pill, borderWidth: 1, paddingVertical: 14 },
  secondaryText: { fontSize: 15, fontWeight: "700" },
});
