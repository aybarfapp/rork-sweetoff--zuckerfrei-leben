import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GradientButton from "@/components/GradientButton";
import { ProgressBar } from "@/components/ProgressRing";
import { useAppStore } from "@/providers/AppStore";

type Props = {
  step: number;
  total: number;
  onBack?: () => void;
  showBack?: boolean;
  cta?: string;
  onNext?: () => void;
  ctaDisabled?: boolean;
  hideProgress?: boolean;
  children: React.ReactNode;
  footerNote?: string;
};

export default function OnboardingScaffold({
  step,
  total,
  onBack,
  showBack = true,
  cta,
  onNext,
  ctaDisabled,
  hideProgress,
  children,
  footerNote,
}: Props) {
  const { palette } = useAppStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: palette.bg, paddingTop: insets.top + 6 }]}>
      {!hideProgress ? (
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            disabled={!showBack}
            hitSlop={12}
            style={[styles.backBtn, { opacity: showBack ? 1 : 0 }]}
          >
            <ChevronLeft size={26} color={palette.text} />
          </Pressable>
          <View style={styles.progressWrap}>
            <ProgressBar progress={(step + 1) / total} track={palette.cardAlt} />
          </View>
          <View style={styles.backBtn} />
        </View>
      ) : null}

      <View style={styles.content}>{children}</View>

      {cta ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
          {footerNote ? <Text style={[styles.note, { color: palette.textMuted }]}>{footerNote}</Text> : null}
          <GradientButton label={cta} onPress={onNext ?? (() => {})} disabled={ctaDisabled} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12, height: 44 },
  backBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  progressWrap: { flex: 1 },
  content: { flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 10, gap: 12 },
  note: { textAlign: "center", fontSize: 13, fontWeight: "500" },
});
