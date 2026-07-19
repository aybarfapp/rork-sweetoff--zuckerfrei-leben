import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { CalendarCheck, CheckCircle2, Flame, Quote, ShieldAlert, Target, TrendingUp, Trophy, Users } from "lucide-react-native";
import { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Logo from "@/components/Logo";
import ProgressRing from "@/components/ProgressRing";
import StreakCalendar from "@/components/StreakCalendar";
import { GRADIENT, RADIUS } from "@/constants/theme";
import { MILESTONES, useAppStore } from "@/providers/AppStore";

const QUOTES = [
  "Du bist stärker als der Drang.",
  "Nicht aufgeben. Der nächste Moment gehört dir.",
  "Jedes Nein macht das nächste leichter.",
  "Der Drang kommt in Wellen. Und Wellen brechen.",
  "Kontrolle ist keine Frage der Willenskraft, sondern der Übung.",
  "Heute ist wieder so ein Tag, an dem du gewinnst.",
];

export default function HomeScreen() {
  const router = useRouter();
  const { palette, streakDays, longestStreak, successRate, cravingsBeaten } = useAppStore();
  const insets = useSafeAreaInsets();

  const nextMilestone = useMemo(() => MILESTONES.find((m) => m > streakDays) ?? MILESTONES[MILESTONES.length - 1], [streakDays]);
  const prevMilestone = useMemo(() => [...MILESTONES].reverse().find((m) => m <= streakDays) ?? 0, [streakDays]);
  const ringProgress = useMemo(() => {
    const span = nextMilestone - prevMilestone;
    return span <= 0 ? 1 : (streakDays - prevMilestone) / span;
  }, [streakDays, nextMilestone, prevMilestone]);

  const quote = useMemo(() => {
    const idx = (new Date().getDate() + streakDays) % QUOTES.length;
    return QUOTES[idx];
  }, [streakDays]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 11) return "Guten Morgen";
    if (h < 18) return "Bleib dran";
    return "Guten Abend";
  }, []);

  const go = (path: "/(tabs)/sos" | "/(tabs)/community") => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push(path);
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Logo size={34} />
            <View>
              <Text style={[styles.greeting, { color: palette.textMuted }]}>{greeting}</Text>
              <Text style={[styles.brand, { color: palette.text }]}>SweetOff</Text>
            </View>
          </View>
        </View>

        {/* Streak hero */}
        <View style={styles.heroWrap}>
          <ProgressRing progress={ringProgress} size={250} strokeWidth={16} trackColor={palette.cardAlt}>
            <View style={{ alignItems: "center" }}>
              <Flame size={30} color={GRADIENT[1]} fill={GRADIENT[0]} />
              <Text style={[styles.streakNumber, { color: palette.text }]}>Tag {streakDays}</Text>
              <Text style={[styles.streakLabel, { color: palette.textMuted }]}>zuckerbewusst</Text>
            </View>
          </ProgressRing>
          <Text style={[styles.nextMilestone, { color: palette.textMuted }]}>
            Noch <Text style={{ color: palette.accent, fontWeight: "800" }}>{nextMilestone - streakDays}</Text> {nextMilestone - streakDays === 1 ? "Tag" : "Tage"} bis Tag {nextMilestone}
          </Text>
        </View>

        {/* Quote */}
        <View style={[styles.quoteCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Quote size={20} color={palette.accent} fill={palette.accent} />
          <Text style={[styles.quoteText, { color: palette.text }]}>{quote}</Text>
        </View>

        {/* Quick access */}
        <View style={styles.section}>
          <Pressable onPress={() => go("/(tabs)/sos")} style={({ pressed }) => [styles.sosCta, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
            <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sosCtaInner}>
              <ShieldAlert size={28} color="#fff" strokeWidth={2.4} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sosCtaTitle}>Craving? SOS drücken</Text>
                <Text style={styles.sosCtaSub}>60-Sekunden-Soforthilfe</Text>
              </View>
            </LinearGradient>
          </Pressable>

          <View style={styles.tileRow}>
            <Pressable onPress={() => go("/(tabs)/sos")} style={[styles.quickTile, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <CalendarCheck size={22} color={palette.accent} />
              <Text style={[styles.quickTileTitle, { color: palette.text }]}>Heutiger Check-in</Text>
              <Text style={[styles.quickTileSub, { color: palette.textMuted }]}>Wie läuft dein Tag?</Text>
            </Pressable>
            <Pressable onPress={() => go("/(tabs)/community")} style={[styles.quickTile, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <Users size={22} color={palette.accent} />
              <Text style={[styles.quickTileTitle, { color: palette.text }]}>Community</Text>
              <Text style={[styles.quickTileSub, { color: palette.textMuted }]}>Ihr schafft das gemeinsam</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Deine Statistik</Text>
          <View style={styles.statRow}>
            <StatBox icon={<TrendingUp size={20} color={palette.accent} />} value={successRate !== null ? `${successRate}%` : "–"} label="Erfolgsquote" />
            <StatBox icon={<Trophy size={20} color={palette.accent} />} value={`${longestStreak}`} label="Längster Streak" />
            <StatBox icon={<CheckCircle2 size={20} color={palette.accent} />} value={`${cravingsBeaten}`} label="Cravings gemeistert" />
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Dein Kalender</Text>
          <StreakCalendar />
        </View>

        {/* Journey */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Deine Reise</Text>
          <View style={{ gap: 10 }}>
            {MILESTONES.map((m) => {
              const done = streakDays >= m;
              const active = m === nextMilestone;
              return (
                <View
                  key={m}
                  style={[
                    styles.journeyRow,
                    { backgroundColor: active ? palette.accentDim : palette.card, borderColor: active ? palette.accent : palette.border, opacity: done || active ? 1 : 0.55 },
                  ]}
                >
                  <View style={[styles.journeyBadge, { backgroundColor: done ? palette.accent : palette.cardAlt }]}>
                    {done ? <CheckCircle2 size={18} color="#fff" strokeWidth={2.6} /> : <Text style={{ color: palette.textMuted, fontWeight: "800", fontSize: 13 }}>{m}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.journeyDay, { color: palette.text }]}>Tag {m}</Text>
                    <Text style={[styles.journeyDesc, { color: palette.textMuted }]}>{milestoneText(m)}</Text>
                  </View>
                  {active ? <Target size={18} color={palette.accent} /> : null}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  const { palette } = useAppStore();
  return (
    <View style={[styles.statBox, { backgroundColor: palette.card, borderColor: palette.border }]}>
      {icon}
      <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: palette.textMuted }]}>{label}</Text>
    </View>
  );
}

function milestoneText(m: number): string {
  switch (m) {
    case 3:
      return "Erste Klarheit – der Nebel lichtet sich";
    case 7:
      return "Eine ganze Woche. Das ist Disziplin.";
    case 14:
      return "Halbzeit – neue Gewohnheit im Aufbau";
    case 30:
      return "Ein neuer Standard. Kein Zurück mehr.";
    case 60:
      return "Zwei Monate stark. Das ist deine neue Normalität.";
    case 90:
      return "90 Tage. Du hast den Drang neu verdrahtet.";
    default:
      return "";
  }
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 8 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  greeting: { fontSize: 13, fontWeight: "600" },
  brand: { fontSize: 20, fontWeight: "900", letterSpacing: 0.5 },

  heroWrap: { alignItems: "center", marginTop: 16, marginBottom: 8 },
  streakNumber: { fontSize: 52, fontWeight: "900", letterSpacing: -2, marginTop: 6 },
  streakLabel: { fontSize: 15, fontWeight: "600", marginTop: -2 },
  nextMilestone: { fontSize: 15, fontWeight: "600", marginTop: 18 },

  quoteCard: { flexDirection: "row", alignItems: "center", gap: 14, marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: RADIUS.lg, borderWidth: 1 },
  quoteText: { flex: 1, fontSize: 16, fontWeight: "700", lineHeight: 22 },

  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 14, letterSpacing: -0.3 },

  sosCta: {},
  sosCtaInner: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18, borderRadius: RADIUS.lg },
  sosCtaTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  sosCtaSub: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600", marginTop: 2 },

  tileRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  quickTile: { flex: 1, borderRadius: RADIUS.lg, borderWidth: 1, padding: 16, gap: 8 },
  quickTileTitle: { fontSize: 15, fontWeight: "800", marginTop: 2 },
  quickTileSub: { fontSize: 12.5, fontWeight: "500" },

  statRow: { flexDirection: "row", gap: 10 },
  statBox: { flex: 1, borderRadius: RADIUS.md, borderWidth: 1, paddingVertical: 16, paddingHorizontal: 6, alignItems: "center", gap: 6 },
  statValue: { fontSize: 22, fontWeight: "900" },
  statLabel: { fontSize: 11, fontWeight: "600", textAlign: "center" },

  journeyRow: { flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1.5, borderRadius: RADIUS.md, padding: 14 },
  journeyBadge: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  journeyDay: { fontSize: 15, fontWeight: "800" },
  journeyDesc: { fontSize: 13, fontWeight: "500", marginTop: 2 },
});
