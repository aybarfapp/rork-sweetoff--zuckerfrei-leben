import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Check, Heart, X } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Confetti from "@/components/Confetti";
import GradientButton from "@/components/GradientButton";
import { GRADIENT, RADIUS } from "@/constants/theme";
import { pickCravingMessage } from "@/constants/cravingMessages";
import { useAppStore } from "@/providers/AppStore";

type Phase = "intensity" | "breathe" | "why" | "result" | "beaten" | "gaveIn";

const BREATH_SECONDS = 60;

export default function SosScreen() {
  const { palette, answers, recentMessages, logCravingOutcome } = useAppStore();
  const insets = useSafeAreaInsets();

  const [phase, setPhase] = useState<Phase>("intensity");
  const [intensity, setIntensity] = useState<number>(6);
  const [message, setMessage] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const reset = useCallback(() => {
    setPhase("intensity");
    setIntensity(6);
    setMessage("");
    setShowConfetti(false);
  }, []);

  const goWhy = useCallback(() => {
    const msg = pickCravingMessage(answers.goals, recentMessages);
    setMessage(msg);
    setPhase("why");
  }, [answers.goals, recentMessages]);

  const finish = useCallback(
    (outcome: "beaten" | "gaveIn") => {
      logCravingOutcome(outcome, message);
      if (outcome === "beaten") {
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setShowConfetti(true);
        setPhase("beaten");
      } else {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
        setPhase("gaveIn");
      }
    },
    [logCravingOutcome, message],
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.topTitle, { color: palette.text }]}>SOS</Text>
        {phase !== "beaten" && phase !== "gaveIn" ? (
          <Pressable onPress={reset} hitSlop={12} style={[styles.closeBtn, { backgroundColor: palette.card }]}>
            <X size={20} color={palette.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {phase === "intensity" ? <IntensityStep value={intensity} onChange={setIntensity} onNext={goWhy} /> : null}
      {phase === "why" ? <BreatheStep message={message} onDone={() => setPhase("result")} /> : null}
      {phase === "result" ? <ResultStep onFinish={finish} /> : null}
      {phase === "beaten" ? <BeatenStep onDone={reset} /> : null}
      {phase === "gaveIn" ? <GaveInStep onDone={reset} /> : null}

      {showConfetti ? <Confetti onDone={() => setShowConfetti(false)} /> : null}
    </View>
  );
}

/* ---------- Step 1: intensity ---------- */

function IntensityStep({ value, onChange, onNext }: { value: number; onChange: (v: number) => void; onNext: () => void }) {
  const { palette } = useAppStore();
  const insets = useSafeAreaInsets();

  const select = (v: number) => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    onChange(v);
  };

  return (
    <View style={[styles.stepWrap, { paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.stepTop}>
        <Text style={[styles.stepTitle, { color: palette.text }]}>Wie stark ist der Drang gerade?</Text>
        <Text style={[styles.stepSub, { color: palette.textMuted }]}>Sei ehrlich zu dir. Dann gehen wir da gemeinsam durch.</Text>

        <View style={styles.intensityDisplay}>
          <Text style={[styles.intensityNumber, { color: palette.accent }]}>{value}</Text>
          <Text style={[styles.intensityMax, { color: palette.textFaint }]}>/ 10</Text>
        </View>
        <Text style={[styles.intensityWord, { color: palette.textMuted }]}>
          {value <= 3 ? "Gut machbar" : value <= 6 ? "Spürbar, aber schaffbar" : value <= 8 ? "Stark – bleib dran" : "Sehr stark – genau jetzt zählt's"}
        </Text>
      </View>

      <View style={styles.scaleWrap}>
        <View style={styles.scaleRow}>
          {Array.from({ length: 10 }).map((_, i) => {
            const n = i + 1;
            const active = n <= value;
            return (
              <Pressable key={n} onPress={() => select(n)} style={styles.scaleTapTarget}>
                <View
                  style={[
                    styles.scaleBar,
                    {
                      height: 30 + i * 7,
                      backgroundColor: active ? palette.accent : palette.cardAlt,
                    },
                  ]}
                />
                <Text style={[styles.scaleNum, { color: n === value ? palette.accent : palette.textFaint }]}>{n}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <GradientButton label="Weiter" onPress={onNext} />
    </View>
  );
}

/* ---------- Step 2: breathe ---------- */

function BreatheStep({ message, onDone }: { message: string; onDone: () => void }) {
  const { palette } = useAppStore();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(0.55)).current;
  const [remaining, setRemaining] = useState<number>(BREATH_SECONDS);
  const [breathText, setBreathText] = useState<string>("Einatmen");

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.55, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();

    const phaseTimer = setInterval(() => {
      setBreathText((t) => (t === "Einatmen" ? "Ausatmen" : "Einatmen"));
    }, 4000);

    const countdown = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      loop.stop();
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [scale]);

  useEffect(() => {
    if (remaining === 0) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [remaining, onDone]);

  const glow = scale.interpolate({ inputRange: [0.55, 1], outputRange: [0.25, 0.55] });

  return (
    <View style={[styles.stepWrap, { paddingBottom: insets.bottom + 20 }]}>
      <View style={{ alignItems: "center", gap: 8 }}>
        <Text style={[styles.stepTitle, { color: palette.text, textAlign: "center" }]}>Der Drang klingt jetzt ab.</Text>
        <Text style={[styles.stepSub, { color: palette.textMuted, textAlign: "center" }]}>Atme mit mir.</Text>
      </View>

      <View style={styles.breatheCenter}>
        <Animated.View style={[styles.breatheGlow, { opacity: glow, transform: [{ scale }] }]} />
        <Animated.View style={{ transform: [{ scale }] }}>
          <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.breatheCircle}>
            <Text style={styles.breatheWord}>{breathText}</Text>
          </LinearGradient>
        </Animated.View>
      </View>

      <View style={{ alignItems: "center", gap: 16 }}>
        <Text style={[styles.timer, { color: palette.text }]}>{remaining}s</Text>
        <View style={[styles.whyPill, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.whyPillText, { color: palette.textMuted }]}>{message}</Text>
        </View>
        <Pressable onPress={onDone} hitSlop={10}>
          <Text style={[styles.skip, { color: palette.textFaint }]}>Überspringen</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------- Step 3: why message (dwell) → shown inside breathe; here result ---------- */

function ResultStep({ onFinish }: { onFinish: (o: "beaten" | "gaveIn") => void }) {
  const { palette } = useAppStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.stepWrap, { paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.stepTop}>
        <Text style={[styles.stepTitle, { color: palette.text }]}>Wie ist es ausgegangen?</Text>
        <Text style={[styles.stepSub, { color: palette.textMuted }]}>Egal wie – du warst ehrlich mit dir. Das zählt.</Text>
      </View>

      <View style={{ gap: 14 }}>
        <GradientButton label="Craving überstanden 💪" onPress={() => onFinish("beaten")} />
        <Pressable onPress={() => onFinish("gaveIn")} style={[styles.secondaryBtn, { borderColor: palette.border, backgroundColor: palette.card }]}>
          <Text style={[styles.secondaryText, { color: palette.textMuted }]}>Nachgegeben</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------- Outcome screens ---------- */

function BeatenStep({ onDone }: { onDone: () => void }) {
  const { palette, cravingsBeaten } = useAppStore();
  const insets = useSafeAreaInsets();
  const scaleIn = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.spring(scaleIn, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
  }, [scaleIn]);

  return (
    <View style={[styles.stepWrap, { paddingBottom: insets.bottom + 20, justifyContent: "center" }]}>
      <View style={{ alignItems: "center", gap: 20 }}>
        <Animated.View style={{ transform: [{ scale: scaleIn }] }}>
          <LinearGradient colors={GRADIENT} style={styles.outcomeCircle}>
            <Check size={56} color="#fff" strokeWidth={3} />
          </LinearGradient>
        </Animated.View>
        <Text style={[styles.outcomeTitle, { color: palette.text }]}>Craving besiegt.</Text>
        <Text style={[styles.outcomeSub, { color: palette.textMuted }]}>
          Genau so gewinnst du die Kontrolle zurück – ein Moment nach dem anderen. Das war dein {cravingsBeaten}. gemeistertes Craving.
        </Text>
      </View>
      <GradientButton label="Fertig" onPress={onDone} />
    </View>
  );
}

function GaveInStep({ onDone }: { onDone: () => void }) {
  const { palette } = useAppStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.stepWrap, { paddingBottom: insets.bottom + 20, justifyContent: "center" }]}>
      <View style={{ alignItems: "center", gap: 20 }}>
        <View style={[styles.outcomeCircle, { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }]}>
          <Heart size={52} color={palette.accent} />
        </View>
        <Text style={[styles.outcomeTitle, { color: palette.text }]}>Kein Problem.</Text>
        <Text style={[styles.outcomeSub, { color: palette.textMuted }]}>
          Morgen ist ein neuer Tag. Dass du überhaupt hier warst und den Drang angeschaut hast, ist der eigentliche Fortschritt. Weiter geht&apos;s.
        </Text>
      </View>
      <GradientButton label="Fertig" onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 8 },
  topTitle: { fontSize: 22, fontWeight: "900", letterSpacing: 1 },
  closeBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },

  stepWrap: { flex: 1, paddingHorizontal: 22, paddingTop: 10, justifyContent: "space-between" },
  stepTop: { gap: 10 },
  stepTitle: { fontSize: 26, fontWeight: "900", letterSpacing: -0.5, lineHeight: 32 },
  stepSub: { fontSize: 15.5, fontWeight: "500", lineHeight: 22 },

  intensityDisplay: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", marginTop: 30, gap: 6 },
  intensityNumber: { fontSize: 84, fontWeight: "900", letterSpacing: -3, lineHeight: 88 },
  intensityMax: { fontSize: 26, fontWeight: "700", marginBottom: 14 },
  intensityWord: { fontSize: 15, fontWeight: "600", textAlign: "center", marginTop: 6 },

  scaleWrap: { alignItems: "center" },
  scaleRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", width: "100%", gap: 4 },
  scaleTapTarget: { flex: 1, alignItems: "center", gap: 8, paddingVertical: 6 },
  scaleBar: { width: "100%", borderRadius: 6 },
  scaleNum: { fontSize: 12, fontWeight: "700" },

  breatheCenter: { alignItems: "center", justifyContent: "center", flex: 1 },
  breatheGlow: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: GRADIENT[0] },
  breatheCircle: { width: 220, height: 220, borderRadius: 110, alignItems: "center", justifyContent: "center" },
  breatheWord: { color: "#fff", fontSize: 24, fontWeight: "800", letterSpacing: 0.5 },

  timer: { fontSize: 40, fontWeight: "900", letterSpacing: -1 },
  whyPill: { borderRadius: RADIUS.lg, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 18 },
  whyPillText: { fontSize: 15, fontWeight: "600", lineHeight: 22, textAlign: "center" },
  skip: { fontSize: 14, fontWeight: "600", paddingVertical: 4 },

  secondaryBtn: { borderRadius: RADIUS.pill, borderWidth: 1, paddingVertical: 17, alignItems: "center" },
  secondaryText: { fontSize: 16, fontWeight: "700" },

  outcomeCircle: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  outcomeTitle: { fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  outcomeSub: { fontSize: 16, fontWeight: "500", lineHeight: 24, textAlign: "center", paddingHorizontal: 10 },
});
