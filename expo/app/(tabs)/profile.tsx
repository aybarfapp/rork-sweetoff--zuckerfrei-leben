import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Bell, Check, ChevronRight, Crown, Flame, Moon, Pencil, RotateCcw, ShieldAlert, Sun, Target, Trash2, TrendingUp, Trophy, X, Zap } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GradientButton from "@/components/GradientButton";
import Logo from "@/components/Logo";
import { RADIUS } from "@/constants/theme";
import { useAppStore } from "@/providers/AppStore";

const TRIGGER_OPTIONS = ["Stress", "Langeweile", "Nach dem Essen", "Abends / vorm Fernseher", "Müdigkeit", "Soziale Situationen", "PMS / Zyklus"];
const GOAL_OPTIONS = ["Mehr Energie", "Reinere Haut", "Bessere Kontrolle & Selbstdisziplin", "Besserer Schlaf", "Gesundes Gewicht", "Allgemein gesünder leben"];
const MODE_OPTIONS = ["Zugesetzten Zucker reduzieren", "Komplett zuckerfrei", "Schrittweise reduzieren"];

type EditTarget = "triggers" | "goals" | "startMode" | null;

export default function ProfileScreen() {
  const router = useRouter();
  const { palette, themeMode, toggleTheme, answers, setAnswers, streakDays, longestStreak, cravingsBeaten, successRate, slipCount, resetStreak, resetAll } = useAppStore();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<boolean>(answers.notifications ?? true);
  const [editing, setEditing] = useState<EditTarget>(null);

  const age = useMemo(() => (answers.birthYear ? new Date().getFullYear() - answers.birthYear : null), [answers.birthYear]);

  const confirmRelapse = () => {
    Alert.alert("Streak zurücksetzen?", "Ein Rückfall ist kein Versagen – er gehört dazu. Dein neuer Tag 1 beginnt sofort, ohne Bewertung.", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Neu starten",
        style: "destructive",
        onPress: () => {
          if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          resetStreak();
        },
      },
    ]);
  };

  const confirmReset = () => {
    Alert.alert("App zurücksetzen?", "Alle deine Daten und dein Onboarding werden gelöscht.", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Alles löschen", style: "destructive", onPress: () => { resetAll(); router.replace("/onboarding"); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40 }}>
        <View style={styles.header}>
          <Logo size={40} />
          <Text style={[styles.title, { color: palette.text }]}>Profil</Text>
        </View>

        {/* Stats hero */}
        <View style={[styles.statHero, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <HeroStat icon={<Flame size={20} color={palette.accent} fill={palette.accent} />} value={`${streakDays}`} label="Streak" />
          <View style={[styles.divider, { backgroundColor: palette.border }]} />
          <HeroStat icon={<Trophy size={20} color={palette.accent} />} value={`${longestStreak}`} label="Rekord" />
          <View style={[styles.divider, { backgroundColor: palette.border }]} />
          <HeroStat icon={<ShieldAlert size={20} color={palette.accent} />} value={`${cravingsBeaten}`} label="Cravings" />
          <View style={[styles.divider, { backgroundColor: palette.border }]} />
          <HeroStat icon={<TrendingUp size={20} color={palette.accent} />} value={successRate !== null ? `${successRate}%` : "–"} label="Quote" />
        </View>

        {/* Abo status */}
        <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
          <View style={[styles.aboCard, { backgroundColor: palette.card, borderColor: palette.accent }]}>
            <View style={[styles.aboIcon, { backgroundColor: palette.accentDim }]}>
              <Crown size={24} color={palette.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.aboTitle, { color: palette.text }]}>SweetOff Premium</Text>
              <Text style={[styles.aboSub, { color: palette.textMuted }]}>Jahresabo · aktiv</Text>
            </View>
            <View style={[styles.aboBadge, { backgroundColor: palette.success }]}>
              <Text style={styles.aboBadgeText}>Aktiv</Text>
            </View>
          </View>
        </View>

        {/* Plan / answers */}
        <Section title="Dein Plan">
          <EditRow label="Fokus" value={answers.startMode ?? "—"} onPress={() => setEditing("startMode")} />
          <EditRow label="Auslöser" value={answers.triggers.length > 0 ? `${answers.triggers.length} gewählt` : "—"} onPress={() => setEditing("triggers")} />
          <EditRow label="Ziele" value={answers.goals.length > 0 ? `${answers.goals.length} gewählt` : "—"} onPress={() => setEditing("goals")} last />
        </Section>

        {(answers.frequency || age) ? (
          <Section title="Über dich">
            {answers.frequency ? <InfoRow label="Ausgangslage" value={answers.frequency} /> : null}
            {age ? <InfoRow label="Alter" value={`${age} Jahre`} last /> : null}
          </Section>
        ) : null}

        {answers.goals.length > 0 ? (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View style={styles.chips}>
              {answers.goals.map((g) => (
                <View key={g} style={[styles.chip, { backgroundColor: palette.accentDim, borderColor: palette.accent }]}>
                  <Target size={13} color={palette.accent} />
                  <Text style={[styles.chipText, { color: palette.accent }]}>{g}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Settings */}
        <Section title="Einstellungen">
          <View style={[styles.settingRow, { borderBottomColor: palette.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
            <View style={styles.settingLeft}>
              {themeMode === "dark" ? <Moon size={20} color={palette.text} /> : <Sun size={20} color={palette.text} />}
              <Text style={[styles.settingLabel, { color: palette.text }]}>Dunkles Design</Text>
            </View>
            <Switch value={themeMode === "dark"} onValueChange={toggleTheme} trackColor={{ true: palette.accent, false: palette.cardAlt }} thumbColor="#fff" />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={palette.text} />
              <Text style={[styles.settingLabel, { color: palette.text }]}>Erinnerungen</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(v) => { setNotifications(v); setAnswers({ notifications: v }); }}
              trackColor={{ true: palette.accent, false: palette.cardAlt }}
              thumbColor="#fff"
            />
          </View>
        </Section>

        {/* Danger actions */}
        <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 12 }}>
          <Pressable onPress={confirmRelapse} style={[styles.actionBtn, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <RotateCcw size={20} color={palette.text} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, { color: palette.text }]}>Streak neu starten</Text>
              <Text style={[styles.actionSub, { color: palette.textMuted }]}>Rückfall gehabt? Kein Problem. Ohne Bewertung.</Text>
            </View>
            <ChevronRight size={20} color={palette.textFaint} />
          </Pressable>

          <Pressable onPress={confirmReset} style={[styles.actionBtn, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Trash2 size={20} color="#E5484D" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, { color: "#E5484D" }]}>App zurücksetzen</Text>
              <Text style={[styles.actionSub, { color: palette.textMuted }]}>Alle Daten & Onboarding löschen</Text>
            </View>
            <ChevronRight size={20} color={palette.textFaint} />
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: palette.textFaint }]}>SweetOff · Tag für Tag stärker{slipCount > 0 ? ` · ${slipCount} Neustarts` : ""}</Text>
      </ScrollView>

      <EditModal target={editing} onClose={() => setEditing(null)} />
    </View>
  );
}

function EditModal({ target, onClose }: { target: EditTarget; onClose: () => void }) {
  const { palette, answers, setAnswers } = useAppStore();
  const insets = useSafeAreaInsets();
  if (!target) return null;

  const config =
    target === "triggers"
      ? { title: "Auslöser bearbeiten", options: TRIGGER_OPTIONS, multi: true, selected: answers.triggers }
      : target === "goals"
        ? { title: "Ziele bearbeiten", options: GOAL_OPTIONS, multi: true, selected: answers.goals }
        : { title: "Fokus ändern", options: MODE_OPTIONS, multi: false, selected: answers.startMode ? [answers.startMode] : [] };

  const toggle = (opt: string) => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    if (target === "startMode") {
      setAnswers({ startMode: opt });
      return;
    }
    const key = target;
    const current = answers[key];
    const next = current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt];
    setAnswers({ [key]: next });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={[styles.modalSheet, { backgroundColor: palette.bgElevated, paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>{config.title}</Text>
            <Pressable onPress={onClose} hitSlop={12} style={[styles.modalClose, { backgroundColor: palette.card }]}>
              <X size={18} color={palette.textMuted} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
            {config.options.map((opt) => {
              const sel = config.selected.includes(opt);
              return (
                <Pressable
                  key={opt}
                  onPress={() => toggle(opt)}
                  style={[styles.optRow, { backgroundColor: sel ? palette.accentDim : palette.card, borderColor: sel ? palette.accent : palette.border }]}
                >
                  <Text style={[styles.optText, { color: sel ? palette.accent : palette.text }]}>{opt}</Text>
                  {sel ? <Check size={18} color={palette.accent} strokeWidth={3} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
          <GradientButton label="Fertig" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  const { palette } = useAppStore();
  return (
    <View style={styles.heroStat}>
      {icon}
      <Text style={[styles.heroValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.heroLabel, { color: palette.textMuted }]}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { palette } = useAppStore();
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
      <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>{children}</View>
    </View>
  );
}

function EditRow({ label, value, onPress, last }: { label: string; value: string; onPress: () => void; last?: boolean }) {
  const { palette } = useAppStore();
  return (
    <Pressable onPress={onPress} style={[styles.infoRow, !last && { borderBottomColor: palette.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.infoLabel, { color: palette.textMuted }]}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 }}>
        <Text style={[styles.infoValue, { color: palette.text }]} numberOfLines={1}>{value}</Text>
        <Pencil size={15} color={palette.accent} />
      </View>
    </Pressable>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { palette } = useAppStore();
  return (
    <View style={[styles.infoRow, !last && { borderBottomColor: palette.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.infoLabel, { color: palette.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: palette.text }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, marginBottom: 18 },
  title: { fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },

  statHero: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, borderRadius: RADIUS.lg, borderWidth: 1, paddingVertical: 18 },
  heroStat: { flex: 1, alignItems: "center", gap: 5 },
  heroValue: { fontSize: 21, fontWeight: "900", letterSpacing: -0.5 },
  heroLabel: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  divider: { width: 1, height: 40 },

  aboCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: RADIUS.lg, borderWidth: 1.5 },
  aboIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  aboTitle: { fontSize: 16, fontWeight: "800" },
  aboSub: { fontSize: 13.5, fontWeight: "500", marginTop: 2 },
  aboBadge: { borderRadius: RADIUS.pill, paddingHorizontal: 12, paddingVertical: 5 },
  aboBadgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },

  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12, letterSpacing: -0.3 },
  card: { borderRadius: RADIUS.lg, borderWidth: 1, paddingHorizontal: 16 },

  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, gap: 10 },
  infoLabel: { fontSize: 15, fontWeight: "500" },
  infoValue: { fontSize: 15, fontWeight: "700", flexShrink: 1 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: RADIUS.pill, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 14 },
  chipText: { fontSize: 13, fontWeight: "700" },

  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  settingLabel: { fontSize: 16, fontWeight: "600" },

  actionBtn: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: RADIUS.lg, borderWidth: 1 },
  actionTitle: { fontSize: 15.5, fontWeight: "700" },
  actionSub: { fontSize: 13, fontWeight: "500", marginTop: 2 },

  footer: { textAlign: "center", fontSize: 13, fontWeight: "600", marginTop: 30 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, paddingHorizontal: 20, paddingTop: 18, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  modalTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.3 },
  modalClose: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  optRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: RADIUS.md, borderWidth: 1.5, paddingVertical: 16, paddingHorizontal: 16 },
  optText: { fontSize: 15.5, fontWeight: "700", flex: 1 },
});

void Zap;
