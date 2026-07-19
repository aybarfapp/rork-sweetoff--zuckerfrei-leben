import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Bell, Check, ChevronDown, Flame, ShieldAlert, Sparkles, Trophy } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CravingChart from "@/components/CravingChart";
import GradientButton from "@/components/GradientButton";
import Logo, { LogoBadge } from "@/components/Logo";
import OnboardingScaffold from "@/components/OnboardingScaffold";
import OptionCard from "@/components/OptionCard";
import ProgressRing from "@/components/ProgressRing";
import { GRADIENT, RADIUS } from "@/constants/theme";
import { useAppStore } from "@/providers/AppStore";

const TOTAL = 14;

export default function Onboarding() {
  const router = useRouter();
  const { palette, answers, setAnswers, startStreak, completeSubscription } = useAppStore();
  const [step, setStep] = useState<number>(0);

  const next = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const finish = useCallback(() => {
    completeSubscription();
    router.replace("/(tabs)/home");
  }, [completeSubscription, router]);

  const scaffoldProps = { step, total: TOTAL, onBack: back, showBack: step > 0 };

  switch (step) {
    case 0:
      return <WelcomeStep {...scaffoldProps} onNext={next} />;
    case 1:
      return <SosPreviewStep {...scaffoldProps} onNext={next} />;
    case 2:
      return (
        <OnboardingScaffold {...scaffoldProps} cta="Weiter" onNext={next} ctaDisabled={!answers.gender}>
          <QuizHeader title="Wähle dein Geschlecht" sub="Das hilft uns, deinen Plan zu kalibrieren." />
          <View style={styles.options}>
            {[
              { id: "mann", label: "Mann" },
              { id: "frau", label: "Frau" },
              { id: "sonstige", label: "Sonstige" },
            ].map((o) => (
              <OptionCard
                key={o.id}
                label={o.label}
                selected={answers.gender === o.id}
                onPress={() => setAnswers({ gender: o.id as "mann" | "frau" | "sonstige" })}
              />
            ))}
          </View>
        </OnboardingScaffold>
      );
    case 3:
      return <BirthYearStep {...scaffoldProps} onNext={next} />;
    case 4:
      return (
        <OnboardingScaffold {...scaffoldProps} cta="Weiter" onNext={next} ctaDisabled={!answers.frequency}>
          <QuizHeader title="Wie oft isst du Süßes oder Zuckerhaltiges?" />
          <View style={styles.options}>
            {["Mehrmals täglich", "Täglich", "Mehrmals pro Woche", "Gelegentlich"].map((o) => (
              <OptionCard key={o} label={o} selected={answers.frequency === o} onPress={() => setAnswers({ frequency: o })} />
            ))}
          </View>
        </OnboardingScaffold>
      );
    case 5:
      return (
        <OnboardingScaffold {...scaffoldProps} cta="Weiter" onNext={next} ctaDisabled={answers.triggers.length === 0}>
          <QuizHeader title="Was löst bei dir Heißhunger aus?" sub="Wähle alles, was zutrifft." />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollOptions}>
            {[
              { l: "Stress", e: "😤" },
              { l: "Langeweile", e: "🥱" },
              { l: "Nach dem Essen", e: "🍽️" },
              { l: "Abends / vorm Fernseher", e: "📺" },
              { l: "Müdigkeit", e: "😴" },
              { l: "Soziale Situationen", e: "🎉" },
              { l: "PMS / Zyklus", e: "🌙" },
            ].map((o) => (
              <OptionCard
                key={o.l}
                label={o.l}
                emoji={o.e}
                multi
                selected={answers.triggers.includes(o.l)}
                onPress={() => toggle(answers.triggers, o.l, (v) => setAnswers({ triggers: v }))}
              />
            ))}
          </ScrollView>
        </OnboardingScaffold>
      );
    case 6:
      return (
        <OnboardingScaffold {...scaffoldProps} cta="Weiter" onNext={next} ctaDisabled={!answers.triedBefore}>
          <QuizHeader title="Hast du schon mal versucht, Zucker zu reduzieren?" sub="Deine Erfahrung hilft uns, einen besseren Plan zu erstellen." />
          <View style={styles.options}>
            {[
              { id: "ja", label: "Ja" },
              { id: "nein", label: "Nein" },
            ].map((o) => (
              <OptionCard
                key={o.id}
                label={o.label}
                selected={answers.triedBefore === o.id}
                onPress={() => setAnswers({ triedBefore: o.id as "ja" | "nein" })}
              />
            ))}
          </View>
        </OnboardingScaffold>
      );
    case 7:
      return <FactsStep {...scaffoldProps} onNext={next} />;
    case 8:
      return (
        <OnboardingScaffold {...scaffoldProps} cta="Weiter" onNext={next} ctaDisabled={answers.goals.length === 0}>
          <QuizHeader title="Was willst du erreichen?" sub="Wähle alles, was zutrifft." />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollOptions}>
            {[
              { l: "Mehr Energie", e: "⚡" },
              { l: "Reinere Haut", e: "✨" },
              { l: "Bessere Kontrolle & Selbstdisziplin", e: "🎯" },
              { l: "Besserer Schlaf", e: "🌙" },
              { l: "Gesundes Gewicht", e: "🪶" },
              { l: "Allgemein gesünder leben", e: "🌱" },
            ].map((o) => (
              <OptionCard
                key={o.l}
                label={o.l}
                emoji={o.e}
                multi
                selected={answers.goals.includes(o.l)}
                onPress={() => toggle(answers.goals, o.l, (v) => setAnswers({ goals: v }))}
              />
            ))}
          </ScrollView>
        </OnboardingScaffold>
      );
    case 9:
      return (
        <OnboardingScaffold {...scaffoldProps} cta="Weiter" onNext={next} ctaDisabled={!answers.startMode}>
          <QuizHeader title="Wie willst du starten?" />
          <View style={styles.options}>
            {[
              { l: "Zugesetzten Zucker reduzieren", s: "Der sanfte, nachhaltige Einstieg." },
              { l: "Komplett zuckerfrei", s: "Der harte Reset. Volle Kontrolle." },
              { l: "Schrittweise reduzieren", s: "Woche für Woche weniger." },
            ].map((o) => (
              <OptionCard key={o.l} label={o.l} sublabel={o.s} selected={answers.startMode === o.l} onPress={() => setAnswers({ startMode: o.l })} />
            ))}
          </View>
        </OnboardingScaffold>
      );
    case 10:
      return <NotificationsStep {...scaffoldProps} onNext={next} />;
    case 11:
      return <CalculatingStep onDone={next} />;
    case 12:
      return <RewardStep {...scaffoldProps} onNext={() => { startStreak(); next(); }} />;
    case 13:
      return <Paywall onFinish={finish} onBack={back} />;
    default:
      return null;
  }
}

function toggle(list: string[], value: string, set: (v: string[]) => void) {
  if (list.includes(value)) set(list.filter((v) => v !== value));
  else set([...list, value]);
}

function QuizHeader({ title, sub }: { title: string; sub?: string }) {
  const { palette } = useAppStore();
  return (
    <View style={styles.quizHeader}>
      <Text style={[styles.quizTitle, { color: palette.text }]}>{title}</Text>
      {sub ? <Text style={[styles.quizSub, { color: palette.textMuted }]}>{sub}</Text> : null}
    </View>
  );
}

type StepProps = { step: number; total: number; onBack: () => void; showBack: boolean; onNext: () => void };

function WelcomeStep(p: StepProps) {
  const { palette } = useAppStore();
  return (
    <OnboardingScaffold {...p} hideProgress cta="Los geht's" onNext={p.onNext}>
      <View style={styles.welcome}>
        <View style={{ alignItems: "center", gap: 22 }}>
          <LogoBadge size={104} />
          <Text style={[styles.brand, { color: palette.text }]}>SweetOff</Text>
        </View>
        <View style={{ gap: 14 }}>
          <Text style={[styles.welcomeHead, { color: palette.text }]}>
            Es geht nicht um Verzicht. Es geht darum, den Drang zu <Text style={{ color: palette.accent }}>besiegen.</Text>
          </Text>
          <Text style={[styles.welcomeSub, { color: palette.textMuted }]}>Besiege deinen Heißhunger – Tag für Tag.</Text>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

function SosPreviewStep(p: StepProps) {
  const { palette } = useAppStore();
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <OnboardingScaffold {...p} cta="Weiter" onNext={p.onNext}>
      <View style={styles.center}>
        <View style={styles.sosMock}>
          <Animated.View style={[styles.sosGlow, { transform: [{ scale }], opacity }]} />
          <LinearGradient colors={GRADIENT} style={styles.sosBtn}>
            <ShieldAlert size={46} color="#fff" strokeWidth={2.2} />
            <Text style={styles.sosBtnText}>SOS</Text>
          </LinearGradient>
        </View>
        <View style={{ gap: 12, marginTop: 46 }}>
          <Text style={[styles.quizTitle, { color: palette.text, textAlign: "center" }]}>Dein Notfallknopf bei Heißhunger</Text>
          <Text style={[styles.quizSub, { color: palette.textMuted, textAlign: "center" }]}>
            Wenn der Drang kommt, führen wir dich in 60 Sekunden hindurch.
          </Text>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

function BirthYearStep(p: StepProps) {
  const { palette, answers, setAnswers } = useAppStore();
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 13;
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= 1940; y--) list.push(y);
    return list;
  }, [maxYear]);
  const year = answers.birthYear ?? 2000;

  const onChange = useCallback(
    (value: number) => {
      if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
      setAnswers({ birthYear: value });
    },
    [setAnswers],
  );

  return (
    <OnboardingScaffold {...p} cta="Weiter" onNext={p.onNext} ctaDisabled={!answers.birthYear}>
      <QuizHeader title="Wann bist du geboren?" sub="Dein Alter hilft uns, deinen Plan anzupassen." />
      <View style={[styles.center, { justifyContent: "flex-start", paddingTop: 20 }]}>
        <View style={styles.wheelWrap}>
          <View pointerEvents="none" style={[styles.wheelHighlight, { backgroundColor: palette.accentDim, borderColor: palette.accent }]} />
          <Picker
            selectedValue={year}
            onValueChange={(v) => onChange(v as number)}
            style={styles.wheel}
            itemStyle={[styles.wheelItem, { color: palette.text }]}
          >
            {years.map((y) => (
              <Picker.Item key={y} label={`${y}`} value={y} color={Platform.OS === "android" ? palette.text : undefined} />
            ))}
          </Picker>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

function FactsStep(p: StepProps) {
  const { palette } = useAppStore();
  return (
    <OnboardingScaffold {...p} cta="Weiter" onNext={p.onNext}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, gap: 22 }}>
        <Text style={[styles.quizTitle, { color: palette.text }]}>
          Nach 21 Tagen verlangt dein Körper messbar weniger Zucker.
        </Text>
        <View style={[styles.chartCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.chartLabel, { color: palette.textMuted }]}>Heißhunger-Intensität</Text>
          <CravingChart width={280} height={170} />
          <View style={styles.milestoneRow}>
            {[
              { d: "Tag 3", t: "Erste Klarheit" },
              { d: "Tag 10", t: "Weniger Drang" },
              { d: "Tag 21", t: "Neu kalibriert" },
            ].map((m) => (
              <View key={m.d} style={styles.milestone}>
                <View style={[styles.dot, { backgroundColor: palette.accent }]} />
                <Text style={[styles.mDay, { color: palette.text }]}>{m.d}</Text>
                <Text style={[styles.mText, { color: palette.textMuted }]}>{m.t}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={[styles.quizSub, { color: palette.textMuted }]}>
          Dein Geschmackssinn passt sich an – jeder Tag macht es leichter.
        </Text>
      </ScrollView>
    </OnboardingScaffold>
  );
}

function NotificationsStep(p: StepProps) {
  const { palette, setAnswers } = useAppStore();
  const [asked, setAsked] = useState<boolean>(false);

  return (
    <OnboardingScaffold
      {...p}
      cta={asked ? "Weiter" : "Erinnerungen aktivieren"}
      onNext={() => {
        if (!asked) {
          setAsked(true);
          setAnswers({ notifications: true });
        } else {
          p.onNext();
        }
      }}
      footerNote={asked ? undefined : "Du kannst das jederzeit im Profil ändern."}
    >
      <View style={styles.center}>
        <LinearGradient colors={["rgba(255,90,46,0.16)", "rgba(255,122,0,0.04)"]} style={styles.bellCircle}>
          <Bell size={54} color={palette.accent} strokeWidth={2} />
        </LinearGradient>
        <Text style={[styles.quizTitle, { color: palette.text, textAlign: "center", marginTop: 30 }]}>
          Erreiche deine Ziele mit Erinnerungen.
        </Text>
        <Text style={[styles.quizSub, { color: palette.textMuted, textAlign: "center", marginTop: 12 }]}>
          Dranbleiben fällt leichter mit rechtzeitiger Unterstützung – für Streak-Erinnerungen und Meilenstein-Feiern.
        </Text>
        {asked ? (
          <View style={[styles.grantedPill, { borderColor: palette.success }]}>
            <Check size={16} color={palette.success} strokeWidth={3} />
            <Text style={{ color: palette.success, fontWeight: "700" }}>Erinnerungen aktiviert</Text>
          </View>
        ) : null}
      </View>
    </OnboardingScaffold>
  );
}

const CALC_DURATION = 5600;

function CalculatingStep({ onDone }: { onDone: () => void }) {
  const { palette, answers } = useAppStore();
  const [progress, setProgress] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const steps = useMemo(
    () => ["Auslöser analysieren …", "Ziele abgleichen …", "Deinen Plan kalibrieren …", "Letzter Feinschliff …"],
    [],
  );
  const [label, setLabel] = useState<string>(steps[0]);

  const tick = useCallback((style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== "web") Haptics.impactAsync(style).catch(() => {});
  }, []);

  useEffect(() => {
    setProgress(1);

    const labelTimers = [
      setTimeout(() => setLabel(steps[1]), CALC_DURATION * 0.25),
      setTimeout(() => setLabel(steps[2]), CALC_DURATION * 0.5),
      setTimeout(() => setLabel(steps[3]), CALC_DURATION * 0.75),
    ];

    // Haptic beats synced to ring fill: light at 25/50/75 %, medium at 100 %.
    const hapticTimers = [
      setTimeout(() => tick(Haptics.ImpactFeedbackStyle.Light), CALC_DURATION * 0.25),
      setTimeout(() => tick(Haptics.ImpactFeedbackStyle.Light), CALC_DURATION * 0.5),
      setTimeout(() => tick(Haptics.ImpactFeedbackStyle.Light), CALC_DURATION * 0.75),
      setTimeout(() => tick(Haptics.ImpactFeedbackStyle.Medium), CALC_DURATION),
    ];

    const start = Date.now();
    const interval = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / CALC_DURATION);
      setPercent(Math.round(p * 100));
      if (p >= 1) clearInterval(interval);
    }, 40);

    const done = setTimeout(() => onDone(), CALC_DURATION + 250);

    return () => {
      labelTimers.forEach(clearTimeout);
      hapticTimers.forEach(clearTimeout);
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [onDone, steps, tick]);

  void answers;
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.center, { flex: 1, backgroundColor: palette.bg, paddingTop: insets.top }]}>
      <ProgressRing progress={progress} size={220} strokeWidth={16} duration={CALC_DURATION} trackColor={palette.cardAlt}>
        <View style={{ alignItems: "center", gap: 6 }}>
          <Sparkles size={34} color={palette.accent} />
          <Text style={[styles.calcPercent, { color: palette.text }]}>{percent}%</Text>
        </View>
      </ProgressRing>
      <Text style={[styles.quizTitle, { color: palette.text, textAlign: "center", marginTop: 40 }]}>Dein Plan wird erstellt …</Text>
      <Text style={[styles.quizSub, { color: palette.textMuted, marginTop: 10 }]}>{label}</Text>
    </View>
  );
}

function RewardStep(p: StepProps) {
  const { palette, answers } = useAppStore();
  const flame = useRef(new Animated.Value(0)).current;
  const scaleIn = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.spring(scaleIn, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(flame, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [flame, scaleIn]);

  const day3Weekday = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("de-DE", { weekday: "long" });
  }, []);

  const glow = flame.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.8] });

  const journey = [
    { d: "🎯 Tag 3", t: `schon ${day3Weekday}!`, active: true },
    { d: "Tag 7", t: "Erste Woche", active: false },
    { d: "Tag 14", t: "Halbzeit", active: false },
    { d: "Tag 21", t: "Weniger Zucker-Drang", active: false },
    { d: "Tag 30", t: "Ein neuer Standard", active: false },
  ];

  return (
    <OnboardingScaffold {...p} cta="Meinen Streak jetzt starten" onNext={p.onNext} hideProgress>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, alignItems: "center", gap: 26 }}>
        <Animated.View style={{ transform: [{ scale: scaleIn }], alignItems: "center" }}>
          <View style={styles.trophyWrap}>
            <Trophy size={40} color={GRADIENT[1]} />
          </View>
          <Text style={[styles.rewardHead, { color: palette.text }]}>Dein Plan ist bereit.</Text>
          <Text style={[styles.rewardSub, { color: palette.accent }]}>Tag 1 beginnt JETZT.</Text>
        </Animated.View>

        <View style={styles.streakCircle}>
          <Animated.View style={[styles.streakGlow, { opacity: glow }]} />
          <Flame size={54} color={GRADIENT[1]} fill={GRADIENT[0]} />
          <Text style={[styles.streakDay, { color: palette.text }]}>0</Text>
          <Text style={[styles.streakLabel, { color: palette.textMuted }]}>Tage</Text>
        </View>

        <View style={{ width: "100%", gap: 12 }}>
          <Text style={[styles.journeyTitle, { color: palette.textMuted }]}>DEINE REISE</Text>
          {journey.map((j) => (
            <View
              key={j.d}
              style={[
                styles.journeyRow,
                {
                  backgroundColor: j.active ? palette.accentDim : palette.card,
                  borderColor: j.active ? palette.accent : palette.border,
                  opacity: j.active ? 1 : 0.55,
                },
              ]}
            >
              <Text style={[styles.journeyDay, { color: j.active ? palette.accent : palette.text }]}>{j.d}</Text>
              <Text style={[styles.journeyText, { color: palette.textMuted }]}>{j.t}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.quizSub, { color: palette.textFaint, textAlign: "center" }]}>
          {answers.startMode ? `Fokus: ${answers.startMode}` : ""}
        </Text>
      </ScrollView>
    </OnboardingScaffold>
  );
}

type PlanKey = "year" | "week";

function Paywall({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const { palette } = useAppStore();
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<PlanKey>("year");

  const bullets = [
    { icon: <ShieldAlert size={20} color={palette.accent} />, t: "SOS-Soforthilfe bei Heißhunger" },
    { icon: <Sparkles size={20} color={palette.accent} />, t: "Persönlicher KI-Coach" },
    { icon: <Trophy size={20} color={palette.accent} />, t: "Community & Meilensteine" },
  ];

  const footerNote = plan === "year" ? "Danach 34,99 € pro Jahr" : "Danach 4,99 € pro Woche";

  return (
    <View style={[styles.root, { backgroundColor: palette.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 22, paddingBottom: 20 }}>
        <Pressable onPress={onBack} hitSlop={14} style={{ marginBottom: 8 }}>
          <ChevronDown size={0} color="transparent" />
        </Pressable>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Logo size={54} />
        </View>
        <Text style={[styles.paywallHead, { color: palette.text }]}>
          Zuckerfrei wird man nicht an einem Tag. Sondern in den 5 Minuten, wenn der Drang kommt.
        </Text>
        <Text style={[styles.paywallSub, { color: palette.textMuted }]}>SweetOff bringt dich durch jede einzelne davon.</Text>

        <View style={{ gap: 12, marginTop: 22, marginBottom: 24 }}>
          {bullets.map((b) => (
            <View key={b.t} style={styles.bulletRow}>
              <View style={[styles.bulletIcon, { backgroundColor: palette.accentDim }]}>{b.icon}</View>
              <Text style={[styles.bulletText, { color: palette.text }]}>{b.t}</Text>
            </View>
          ))}
        </View>

        <PlanCard
          selected={plan === "year"}
          onPress={() => setPlan("year")}
          badge="BESTER WERT"
          title="Jahresabo"
          price="34,99 € / Jahr"
          sub="Nur 0,67 € pro Woche statt 4,99 € – spare 87 %"
          extra="3 Tage kostenlos testen"
        />
        <PlanCard
          selected={plan === "week"}
          onPress={() => setPlan("week")}
          title="Wochenabo"
          price="4,99 € / Woche"
        />

        <View style={styles.reassure}>
          <Check size={16} color={palette.success} strokeWidth={3} />
          <Text style={[styles.reassureText, { color: palette.textMuted }]}>
            Jederzeit kündbar. Keine Zahlung während der Testphase.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.paywallFooter, { paddingBottom: insets.bottom + 14, backgroundColor: palette.bg, borderTopColor: palette.border }]}>
        <GradientButton label="Meine Reise starten" onPress={onFinish} />
        <Text style={[styles.paywallFootNote, { color: palette.textMuted }]}>{footerNote}</Text>
      </View>
    </View>
  );
}

function PlanCard({
  selected,
  onPress,
  badge,
  title,
  price,
  sub,
  extra,
}: {
  selected: boolean;
  onPress: () => void;
  badge?: string;
  title: string;
  price: string;
  sub?: string;
  extra?: string;
}) {
  const { palette } = useAppStore();
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={[
        styles.planCard,
        { backgroundColor: selected ? palette.accentDim : palette.card, borderColor: selected ? palette.accent : palette.border },
      ]}
    >
      {badge ? (
        <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </LinearGradient>
      ) : null}
      <View style={styles.planTop}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.planTitle, { color: palette.text }]}>{title}</Text>
          <Text style={[styles.planPrice, { color: palette.text }]}>{price}</Text>
        </View>
        <View style={[styles.radio, { borderColor: selected ? palette.accent : palette.textFaint, backgroundColor: selected ? palette.accent : "transparent" }]}>
          {selected ? <Check size={15} color="#fff" strokeWidth={3} /> : null}
        </View>
      </View>
      {sub ? <Text style={[styles.planSub, { color: palette.accent }]}>{sub}</Text> : null}
      {extra ? <Text style={[styles.planExtra, { color: palette.textMuted }]}>{extra}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  options: { paddingHorizontal: 22, gap: 12, marginTop: 8 },
  scrollOptions: { paddingHorizontal: 22, gap: 12, paddingBottom: 20 },
  quizHeader: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 22, gap: 10 },
  quizTitle: { fontSize: 26, fontWeight: "800", lineHeight: 32, letterSpacing: -0.5 },
  quizSub: { fontSize: 15, fontWeight: "500", lineHeight: 21 },

  welcome: { flex: 1, justifyContent: "space-between", paddingHorizontal: 26, paddingTop: 60, paddingBottom: 30 },
  brand: { fontSize: 34, fontWeight: "900", letterSpacing: 1 },
  welcomeHead: { fontSize: 32, fontWeight: "900", lineHeight: 38, letterSpacing: -0.6 },
  welcomeSub: { fontSize: 17, fontWeight: "500" },

  sosMock: { width: 180, height: 180, alignItems: "center", justifyContent: "center" },
  sosGlow: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: GRADIENT[0] },
  sosBtn: { width: 150, height: 150, borderRadius: 75, alignItems: "center", justifyContent: "center", gap: 4 },
  sosBtnText: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 2 },

  wheelWrap: { width: "100%", height: 220, justifyContent: "center" },
  wheelHighlight: { position: "absolute", left: 24, right: 24, height: 46, top: "50%", marginTop: -23, borderRadius: RADIUS.md, borderWidth: 1.5 },
  wheel: { width: "100%", ...(Platform.OS === "android" ? { height: 60 } : { height: 220 }) },
  wheelItem: { fontSize: 28, fontWeight: "800" },
  calcPercent: { fontSize: 30, fontWeight: "900", letterSpacing: -1 },

  chartCard: { borderRadius: RADIUS.lg, borderWidth: 1, padding: 18, alignItems: "center", gap: 12 },
  chartLabel: { alignSelf: "flex-start", fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  milestoneRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 8 },
  milestone: { alignItems: "center", flex: 1, gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  mDay: { fontSize: 14, fontWeight: "800" },
  mText: { fontSize: 11, fontWeight: "500", textAlign: "center" },

  bellCircle: { width: 130, height: 130, borderRadius: 65, alignItems: "center", justifyContent: "center" },
  grantedPill: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1.5, borderRadius: RADIUS.pill, paddingVertical: 10, paddingHorizontal: 18, marginTop: 24 },

  trophyWrap: { width: 84, height: 84, borderRadius: 42, backgroundColor: "rgba(255,122,0,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  rewardHead: { fontSize: 26, fontWeight: "900", textAlign: "center", letterSpacing: -0.5 },
  rewardSub: { fontSize: 20, fontWeight: "800", textAlign: "center", marginTop: 4 },

  streakCircle: { width: 190, height: 190, borderRadius: 95, borderWidth: 2, borderColor: "rgba(255,122,0,0.3)", alignItems: "center", justifyContent: "center", gap: 2 },
  streakGlow: { position: "absolute", width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,90,46,0.18)" },
  streakDay: { fontSize: 60, fontWeight: "900", letterSpacing: -2 },
  streakLabel: { fontSize: 14, fontWeight: "600", marginTop: -6 },

  journeyTitle: { fontSize: 12, fontWeight: "800", letterSpacing: 1.2, marginBottom: 2 },
  journeyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1.5, borderRadius: RADIUS.md, paddingVertical: 15, paddingHorizontal: 18 },
  journeyDay: { fontSize: 16, fontWeight: "800" },
  journeyText: { fontSize: 13, fontWeight: "500" },

  paywallHead: { fontSize: 25, fontWeight: "900", lineHeight: 31, letterSpacing: -0.5, textAlign: "center" },
  paywallSub: { fontSize: 15, fontWeight: "500", textAlign: "center", marginTop: 12 },
  bulletRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  bulletIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  bulletText: { fontSize: 16, fontWeight: "700", flex: 1 },

  planCard: { borderWidth: 2, borderRadius: RADIUS.lg, padding: 18, marginBottom: 14 },
  planTop: { flexDirection: "row", alignItems: "center" },
  planTitle: { fontSize: 15, fontWeight: "700" },
  planPrice: { fontSize: 22, fontWeight: "900", marginTop: 2, letterSpacing: -0.5 },
  planSub: { fontSize: 14, fontWeight: "700", marginTop: 10 },
  planExtra: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  badge: { position: "absolute", top: -11, left: 18, borderRadius: RADIUS.pill, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "900", letterSpacing: 0.8 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },

  reassure: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 },
  reassureText: { fontSize: 13, fontWeight: "500" },

  paywallFooter: { paddingHorizontal: 22, paddingTop: 12, borderTopWidth: 1, gap: 8 },
  paywallFootNote: { textAlign: "center", fontSize: 13, fontWeight: "500" },
});
